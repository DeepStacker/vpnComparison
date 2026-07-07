export function barChart(
  data: Array<{ label: string; value: number; color?: string }>,
  options: { height?: number; maxValue?: number; showLabels?: boolean; className?: string } = {},
): string {
  const { height = 200, maxValue, showLabels = true, className = '' } = options;
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  void (showLabels ? height - 20 : height);
  void data.length;
  return `
    <div class="flex items-end justify-between gap-1 ${className}" style="height:${height}px">
      ${data.map((d) => {
        const pct = (d.value / max) * 100;
        const color = d.color ?? 'var(--color-primary)';
        return `<div class="flex flex-col items-center flex-1 h-full justify-end">
          <div class="w-full rounded-t-md transition-all duration-700 ease-out" style="height:${pct}%;background:${color};min-height:4px" title="${d.label}: ${d.value}"></div>
          ${showLabels ? `<span class="mt-1.5 text-[10px] font-bold text-muted-foreground truncate w-full text-center">${d.label}</span>` : ''}
        </div>`;
      }).join('')}
    </div>`;
}

export function horizontalBarChart(
  data: Array<{ label: string; value: number; maxValue?: number; color?: string }>,
  options: { showValue?: boolean; className?: string } = {},
): string {
  const { showValue = true, className = '' } = options;
  return `
    <div class="space-y-2 ${className}">
      ${data.map((d) => {
        const max = d.maxValue ?? 100;
        const pct = Math.min((d.value / max) * 100, 100);
        const color = d.color ?? 'var(--color-primary)';
        return `<div>
          <div class="flex items-center justify-between text-xs font-bold mb-1">
            <span class="text-foreground">${d.label}</span>
            ${showValue ? `<span class="text-muted-foreground">${d.value}</span>` : ''}
          </div>
          <div class="h-2 w-full rounded-full bg-surface-sunken border border-border/50 overflow-hidden shadow-inner">
            <div class="h-full rounded-full transition-all duration-700 ease-out" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

export function donutChart(
  value: number,
  max: number,
  options: { size?: number; strokeWidth?: number; color?: string; label?: string } = {},
): string {
  const { size = 120, strokeWidth = 8, color, label } = options;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  const fillColor = color ?? (pct >= 0.8 ? 'var(--color-success)' : pct >= 0.5 ? 'var(--color-primary)' : 'var(--color-warning)');
  const number = Math.round(pct * 100);
  return `
    <div class="relative inline-flex items-center justify-center" style="width:${size}px;height:${size}px">
      <svg class="-rotate-90" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="var(--color-border)" stroke-width="${strokeWidth}" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${fillColor}" stroke-width="${strokeWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" class="transition-all duration-1000 ease-out" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-black tracking-tighter" style="color:${fillColor}">${number}%</span>
        ${label ? `<span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">${label}</span>` : ''}
      </div>
    </div>`;
}

export function sparkline(
  data: number[],
  options: { width?: number; height?: number; color?: string; strokeWidth?: number } = {},
): string {
  const { width = 120, height = 32, color = 'var(--color-primary)', strokeWidth = 2 } = options;
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="inline-block align-middle">
      <polyline fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>`;
}

export function radarChart(
  categories: Array<{ label: string; value: number }>,
  options: { size?: number; color?: string; maxValue?: number } = {},
): string {
  const { size = 180, color = 'var(--color-primary)', maxValue = 100 } = options;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const angleStep = (2 * Math.PI) / categories.length;
  const startAngle = -Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map((level) => {
    return categories.map((_, i) => {
      const a = startAngle + i * angleStep;
      const r = radius * level;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  });

  const dataPoints = categories.map((c, i) => {
    const a = startAngle + i * angleStep;
    const r = radius * (c.value / maxValue);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="inline-block">
      ${gridPolygons.map((p) => `<polygon fill="var(--color-surface-sunken)" fill-opacity="0.5" stroke="var(--color-border)" stroke-width="0.5" points="${p}" />`).join('')}
      <polygon fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" points="${dataPoints}" />
      ${categories.map((c, i) => {
        const a = startAngle + i * angleStep;
        const labelR = radius + 16;
        const lx = cx + labelR * Math.cos(a);
        const ly = cy + labelR * Math.sin(a);
        const anchor = a > 0 && a < Math.PI ? 'start' : a > Math.PI ? 'end' : 'middle';
        return `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle" fill="var(--color-muted-foreground)" font-size="9" font-weight="700" font-family="var(--font-sans)">${c.label}</text>`;
      }).join('')}
    </svg>`;
}

export function trendIndicator(current: number, previous: number): string {
  const diff = current - previous;
  const pct = previous !== 0 ? Math.round((diff / previous) * 100) : 0;
  const isUp = diff > 0;
  const isNeutral = diff === 0;
  const color = isUp ? 'var(--color-success)' : isNeutral ? 'var(--color-muted-foreground)' : 'var(--color-danger)';
  const arrow = isUp ? '↑' : isNeutral ? '→' : '↓';
  return `<span class="inline-flex items-center gap-1 text-xs font-bold" style="color:${color}">${arrow} ${Math.abs(pct)}%</span>`;
}
