import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { defaultMatchSettings } from '@playoverlay/core';
import TimeDisplay, { clockFontSize } from '../TimeDisplay/TimeDisplay';

const cqw = (size: string) => Number(/([\d.]+)cqw/.exec(size)?.[1]);

describe('clockFontSize', () => {
  it('keeps one size from kick-off to 99:59', () => {
    expect(clockFontSize('0:00')).toBe(clockFontSize('45:00'));
    expect(clockFontSize('99:59')).toBe(clockFontSize('45:00'));
  });

  it('steps down for three-digit minutes and for added time, so both still fit', () => {
    expect(cqw(clockFontSize('105:13'))).toBeLessThan(
      cqw(clockFontSize('45:00'))
    );
    expect(cqw(clockFontSize('105:13', 5))).toBeLessThan(
      cqw(clockFontSize('105:13'))
    );
    expect(cqw(clockFontSize('105:13', 10))).toBeLessThan(
      cqw(clockFontSize('105:13', 5))
    );
  });

  it('makes room for the remaining time, and keeps one size when it goes negative', () => {
    expect(cqw(clockFontSize('45:00', undefined, '00:00'))).toBeLessThan(
      cqw(clockFontSize('45:00'))
    );
    expect(clockFontSize('44:30', undefined, '00:30')).toBe(
      clockFontSize('45:30', undefined, '-0:30')
    );
    expect(clockFontSize('45:30', undefined, '-0:30')).toBe(
      clockFontSize('59:47', undefined, '-14:47')
    );
  });
});

describe('TimeDisplay', () => {
  it('sizes the clock row from the clock, the added time and the remaining time', () => {
    render(
      <TimeDisplay
        time={{
          time: '47:30',
          additionalTime: 3,
          remainingTime: '00:00',
          matchPhase: 'firstHalf',
          paused: true,
        }}
        matchSettings={defaultMatchSettings}
      />
    );
    // The clock and the remaining time share one row whose font size both
    // are drawn from, so the row carries the size.
    const row = screen.getByText('47:30').closest('div');
    expect(row?.style.fontSize).toBe(clockFontSize('47:30', 3, '00:00'));
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
