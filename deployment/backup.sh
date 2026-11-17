#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# NextGen IT Hub — Automated Daily Encrypted PostgreSQL Backup
# Follows PCI-DSS & DPDP Act Data Integrity & Retention Standard
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/nextgen-it-hub}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="nextgen_db_${DATE}"
RAW_DUMP="${BACKUP_DIR}/${BACKUP_NAME}.dump"
ENCRYPTED_ARCHIVE="${BACKUP_DIR}/${BACKUP_NAME}.dump.enc"

# Database Connection Parameters
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-nextgen_user}"
DB_NAME="${DB_NAME:-nextgen_it_hub}"

# Encryption Passphrase (Must be stored securely in root-owned environment or HSM)
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-${ENCRYPTION_KEY:-}}"

# Healthchecks.io heartbeat ping URL (optional)
HEALTHCHECK_URL="${HEALTHCHECK_BACKUP_URL:-}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

cleanup() {
    # Remove unencrypted temporary dump immediately
    if [[ -f "${RAW_DUMP}" ]]; then
        rm -f "${RAW_DUMP}"
        log "Temporary raw dump cleaned up."
    fi
}
trap cleanup EXIT

# 1. Validation
if [[ -z "${BACKUP_ENCRYPTION_KEY}" ]]; then
    log "ERROR: BACKUP_ENCRYPTION_KEY environment variable is not defined!"
    exit 1
fi

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

log "Starting database backup for database: ${DB_NAME} at ${DB_HOST}:${DB_PORT}"

# 2. Execute pg_dump
log "Dumping PostgreSQL database schema and data..."
PGPASSWORD="${PGPASSWORD:-}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -F c \
    -b \
    -v \
    -f "${RAW_DUMP}" \
    "${DB_NAME}"

if [[ ! -s "${RAW_DUMP}" ]]; then
    log "ERROR: Database dump produced an empty file!"
    if [[ -n "${HEALTHCHECK_URL}" ]]; then
        curl -fsS -m 10 --retry 3 "${HEALTHCHECK_URL}/fail" || true
    fi
    exit 1
fi

RAW_SIZE=$(du -h "${RAW_DUMP}" | cut -f1)
log "Raw database dump complete. Size: ${RAW_SIZE}"

# 3. Encrypt with AES-256-CBC (OpenSSL)
log "Encrypting backup archive with OpenSSL AES-256-CBC..."
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
    -in "${RAW_DUMP}" \
    -out "${ENCRYPTED_ARCHIVE}" \
    -pass pass:"${BACKUP_ENCRYPTION_KEY}"

chmod 600 "${ENCRYPTED_ARCHIVE}"
ENC_SIZE=$(du -h "${ENCRYPTED_ARCHIVE}" | cut -f1)
log "Encrypted backup successfully created: ${ENCRYPTED_ARCHIVE} (Size: ${ENC_SIZE})"

# 4. Optional Offsite Synchronization (e.g. AWS S3 / Cloudflare R2 via rclone)
if command -v aws &> /dev/null && [[ -n "${S3_BACKUP_BUCKET:-}" ]]; then
    log "Uploading encrypted archive to S3 bucket: ${S3_BACKUP_BUCKET}..."
    aws s3 cp "${ENCRYPTED_ARCHIVE}" "s3://${S3_BACKUP_BUCKET}/db-backups/${BACKUP_NAME}.dump.enc" --sse AES256
    log "S3 upload completed."
fi

# 5. Prune Local Backups Older than Retention Window
log "Pruning encrypted local backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "nextgen_db_*.dump.enc" -mtime +"${RETENTION_DAYS}" -exec rm -f {} +

# 6. Notify Healthcheck
if [[ -n "${HEALTHCHECK_URL}" ]]; then
    curl -fsS -m 10 --retry 3 "${HEALTHCHECK_URL}" || true
    log "Healthcheck heartbeat ping transmitted."
fi

log "Database backup lifecycle routine completed successfully."
exit 0
