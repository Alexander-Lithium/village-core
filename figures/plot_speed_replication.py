import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
D = {
 'PC, Claude desktop app': [(10, 0.027), (30, 0.048), (100, 0.121), (300, 0.34), (1000, 1.094), (3000, 3.265), (10000, 10.673), (30000, 32.385), (100000, 115.581), (300000, 300.25)],
 'PC, Edge browser': [(10, 0.033), (30, 0.081), (100, 0.19), (300, 0.848), (1000, 1.731), (3000, 4.89), (10000, 15.133), (30000, 44.459), (100000, 112.15), (300000, 426.85)],
 'Pixel 10 Pro XL': [(10, 0.069), (30, 0.106), (100, 0.219), (300, 0.488), (1000, 1.167), (3000, 2.456), (10000, 8.815), (30000, 27.163), (100000, 96.737), (300000, 292.583)],
 'Galaxy A54': [(10, 0.058), (30, 0.108), (100, 0.256), (300, 0.652), (1000, 2.35), (3000, 5.375), (10000, 17.794), (30000, 48.8), (100000, 152.18)],
}
COL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100']
MK = ['o', 's', '^', 'D']
INK, MUTED, GRID, SURF = '#0b0b0b', '#52514e', '#e4e2dc', '#fcfcfb'
fig, ax = plt.subplots(figsize=(9, 5.6), dpi=200)
fig.patch.set_facecolor(SURF); ax.set_facecolor(SURF)
ax.set_xscale('log'); ax.set_yscale('log')
budget = 18750
ax.axhline(budget, color=MUTED, lw=1, ls=(0, (4, 4)), zorder=1)
ax.text(12, budget * 1.3, 'Budget: 1 in-game day = 5 real minutes (18.75 s per in-game hour)', color=MUTED, fontsize=8.5, va='bottom')
ax.axhline(16.7, color=MUTED, lw=1, ls=(0, (1, 3)), zorder=1)
ax.text(12, 16.7 * 1.25, 'One 60 fps video frame (16.7 ms)', color=MUTED, fontsize=8.5, va='bottom')
for (name, pts), c, m in zip(D.items(), COL, MK):
    x, y = zip(*pts)
    ax.plot(x, y, color=c, lw=2, zorder=3, label=name)
    ax.plot(x, y, ls='none', marker=m, ms=6.5, mfc=c, mec=SURF, mew=1.5, zorder=4)
# direct labels at the last point, offset to avoid collisions
offs = {'PC, Claude desktop app': (8, -2), 'PC, Edge browser': (8, 10), 'Pixel 10 Pro XL': (8, -14), 'Galaxy A54': (-8, 14)}
for name, pts in D.items():
    ax.annotate(name, pts[-1], xytext=offs[name], textcoords='offset points', fontsize=8.5, color=INK, va='center', ha='right' if offs[name][0] < 0 else 'left')
ax.set_xlim(7, 2.5e6); ax.set_ylim(0.01, 1e5)
ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f'{int(v):,}' if v >= 1 else ''))
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: (f'{v:,.0f}' if v >= 1 else f'{v:g}')))
ax.grid(True, which='major', color=GRID, lw=0.8); ax.set_axisbelow(True)
for s in ['top', 'right']: ax.spines[s].set_visible(False)
for s in ['left', 'bottom']: ax.spines[s].set_color(GRID)
ax.tick_params(colors=MUTED, labelsize=9)
ax.set_xlabel('Villagers (log scale)', color=INK, fontsize=10)
ax.set_ylabel('Real time per in-game hour, ms (log scale)', color=INK, fontsize=10)
ax.set_title('Replication: simulation time grows linearly with villager count on all four devices', color=INK, fontsize=12, loc='left', pad=12)
leg = ax.legend(loc='lower right', frameon=False, fontsize=8.5, labelcolor=INK)
fig.text(0.01, 0.005, 'Median of 3 repeats up to 10,000 villagers, 1 run above. Consensus tables, decision logging off.\nEach test stopped at the device\'s safe memory limit: 300,000 villagers (100,000 on the Galaxy A54).', fontsize=7.5, color=MUTED)
fig.tight_layout(rect=(0, 0.05, 1, 1))
fig.savefig('figures/fig_speed_scaling_replication.png', facecolor=SURF)
fig.savefig('figures/fig_speed_scaling_replication.svg', facecolor=SURF)
