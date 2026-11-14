import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
D = {
 'PC, Claude desktop app':   [(10,.0250),(30,.0542),(100,.1250),(300,.3229),(1000,.9562),(3000,2.8458),(10000,10.7229),(30000,32.2787),(100000,118.5938),(300000,310.26)],
 'PC, Edge browser':         [(10,.0354),(30,.0542),(100,.1333),(300,.3333),(1000,1.0625),(3000,3.2792),(10000,12.0062),(30000,38.045),(100000,129.7312),(300000,414.325)],
 'Pixel 10 Pro XL':          [(10,.0813),(30,.2583),(100,.3375),(300,.7667),(1000,1.7042),(3000,3.9958),(10000,10.325),(30000,28.4417),(100000,101.175),(300000,262.0667)],
 'Galaxy A54':               [(10,.0729),(30,.1937),(100,.45),(300,1.1104),(1000,3.0208),(3000,9.6417),(10000,27.4729),(30000,78.495),(100000,249.1429)],
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
ax.set_title('Simulation time grows linearly with villager count on all four devices', color=INK, fontsize=12, loc='left', pad=12)
leg = ax.legend(loc='lower right', frameon=False, fontsize=8.5, labelcolor=INK)
fig.text(0.01, 0.005, 'Median of 3 repeats up to 1,000 villagers, 1 run above. Consensus tables, decision logging off.\nEach test stopped at the device\'s safe memory limit: 300,000 villagers (100,000 on the Galaxy A54).', fontsize=7.5, color=MUTED)
fig.tight_layout(rect=(0, 0.05, 1, 1))
fig.savefig('figures/fig_speed_scaling.png', facecolor=SURF)
fig.savefig('figures/fig_speed_scaling.svg', facecolor=SURF)
