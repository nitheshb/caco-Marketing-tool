const fs = require('fs');
const files = [
  'components/dashboard/calendar/day-view.tsx',
  'components/dashboard/calendar/calendar-modal.tsx'
];
const map = {
  'bg-[#0e0e0e]': 'bg-white',
  'border-[#212121]': 'border-zinc-200',
  'scrollbar-thumb-[#212121]': 'scrollbar-thumb-zinc-200',
  'scrollbar-track-[#0e0e0e]': 'scrollbar-track-zinc-50',
  'bg-[#1e1d1d]': 'bg-zinc-50',
  'text-[#9c9c9c]': 'text-zinc-500',
  'bg-[#1a1919]': 'bg-zinc-50',
  'text-[#fc69ff]': 'text-indigo-600',
  'bg-[#fc69ff]': 'bg-indigo-600',
  'bg-[#2a2a2a]': 'bg-zinc-100',
  'border-[#454444]': 'border-zinc-300',
  'hover:border-[#612bd3]': 'hover:border-indigo-300',
  'border-[#612bd3]': 'border-indigo-600',
  'bg-[#612bd3]': 'bg-indigo-600',
  'text-[#612bd3]': 'text-indigo-600',
  'ring-[#612bd3]': 'ring-indigo-600',
  'hover:border-[#454444]': 'hover:border-zinc-300',
  'hover:bg-[#1a1919]': 'hover:bg-zinc-50',
  'hover:bg-[#201f1f]': 'hover:bg-zinc-100',
  'hover:bg-black': 'hover:bg-zinc-100',
  'bg-[#291259]': 'bg-indigo-50',
  'border-[#fc69ff]': 'border-indigo-600',
  'hover:bg-[#7236f1]': 'hover:bg-indigo-700',
  'bg-[#141313]': 'bg-zinc-100',
  'color-scheme:dark': 'color-scheme:light',
  'rgba(255,255,255,0.02)': 'rgba(0,0,0,0.03)',
  'text-zinc-900 shadow-2xl': 'text-zinc-900 shadow-xl'
};

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  for (const [k, v] of Object.entries(map)) {
    content = content.split(k).join(v);
  }
  // Remove dark mode specific shadcn styling hook
  content = content.replace(/dark:text-zinc-900/g, 'text-zinc-900');
  // special case for day-view cell borders
  content = content.replace(/'bg-\[#1a1919\] hover:border-\[#612BD3\]'/g, "'bg-white hover:border-indigo-600'");
  content = content.replace(/'border-transparent opacity-60 hover:opacity-100 hover:scale-105'/g, "'border-transparent opacity-60 hover:opacity-100 ring-2 ring-transparent transition-all'");
  fs.writeFileSync(f, content);
});
console.log('Hex replacement done');
