'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  height?: number;
  width?: number;
  variant?: 'horizontal' | 'stacked' | 'icon';
  priority?: boolean;
}

export function Logo({
  className = '',
  iconOnly = false,
  height = 42,
  width,
  variant,
  priority = true,
}: LogoProps) {
  const selectedVariant = variant || (iconOnly ? 'icon' : 'horizontal');

  // Aspect ratios:
  // Icon / Emblem: 725 / 353 ~ 2.054
  // Horizontal: 1284 / 260 ~ 4.938
  // Stacked: 1089 / 676 ~ 1.611
  const calcWidth = width || (
    selectedVariant === 'icon'
      ? Math.round(height * 2.054)
      : selectedVariant === 'stacked'
      ? Math.round(height * 1.611)
      : Math.round(height * 4.938)
  );

  if (selectedVariant === 'icon') {
    return (
      <div
        className={cn('relative inline-flex items-center shrink-0', className)}
        style={{ height, width: calcWidth }}
      >
        <Image
          src="/images/logo-icon.png"
          alt="NextGen IT Hub"
          width={calcWidth}
          height={height}
          priority={priority}
          className="h-full w-auto object-contain drop-shadow-sm select-none"
        />
      </div>
    );
  }

  if (selectedVariant === 'stacked') {
    return (
      <div
        className={cn('relative inline-flex items-center shrink-0', className)}
        style={{ height, width: calcWidth }}
      >
        <Image
          src="/images/logo-stacked.png"
          alt="NextGen IT Hub"
          width={calcWidth}
          height={height}
          priority={priority}
          className="h-full w-auto object-contain drop-shadow-sm select-none"
        />
      </div>
    );
  }

  // Default: Horizontal Logo with Light / Dark theme adaptation
  return (
    <div
      className={cn('relative inline-flex items-center shrink-0', className)}
      style={{ height, width: calcWidth }}
    >
      {/* Light theme: Rich 3D metallic N (royal blue) & G (deep titanium slate) */}
      <Image
        src="/images/logo-horizontal.png"
        alt="NextGen IT Hub"
        width={calcWidth}
        height={height}
        priority={priority}
        className="h-full w-auto object-contain dark:hidden drop-shadow-sm select-none"
      />

      {/* Dark theme: Optimized titanium silver/cool sheen for dark backgrounds */}
      <Image
        src="/images/logo-horizontal-dark.png"
        alt="NextGen IT Hub"
        width={calcWidth}
        height={height}
        priority={priority}
        className="h-full w-auto object-contain hidden dark:block drop-shadow-sm select-none"
      />
    </div>
  );
}

