import json, statistics as st, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
d = json.load(open('reports/exp9_longrun_consensus_blind8.json'))
S = [r['series'] for r in d['runs']]; days = [x['day'] for x in S[0]]
m = lambda k, f=lambda v: v: [st.mean(f(s[i][k]) for s in S) for i in range(len(days))]
PAIRS = 50 * 190
INK, MUTED, GRID, SURF = '#0b0b0b', '#52514e', '#e4e2dc', '#fcfcfb'
C1, C2 = '#2a78d6', '#eb6834'
fig, axs = plt.subplots(2, 2, figsize=(10, 6.4), dpi=200); fig.patch.set_facecolor(SURF)
panels = [
 ('Inner life: belief changes per villager per 100 days', [('', m('beliefMovesPerVillagerPer100d'), C1)], None, (0, 16)),
 ('Inner life: villagers whose beliefs changed in the last 50 days (%)', [('', m('profileChangedShare', lambda v: v * 100), C1)], None, (0, 100)),
 ('Social life: likings that changed in the last 50 days (%)', [('', m('likingChangedShare', lambda v: v * 100), C2)], 1, (0, 30)),
 ('Social life: pairs of villagers (%)', [('Mutual friends', m('friendships', lambda v: v / PAIRS * 100), C1), ('Mutual enemies (feuds)', m('feuds', lambda v: v / PAIRS * 100), C2)], None, (0, 70)),
]
for ax, (title, series, skip, yl) in zip(axs.flat, panels):
    ax.set_facecolor(SURF)
    for name, ys, c in series:
        x, y = (days[skip:], ys[skip:]) if skip else (days, ys)
        ax.plot(x, y, color=c, lw=2)
        if name: ax.annotate(name, (x[-1], y[-1]), xytext=(-4, 9), textcoords='offset points', ha='right', fontsize=8.5, color=INK)
    ax.set_title(title, loc='left', fontsize=9.5, color=INK); ax.set_ylim(*yl); ax.set_xlim(0, 1000)
    ax.grid(True, color=GRID, lw=0.8); ax.set_axisbelow(True)
    for s in ['top', 'right']: ax.spines[s].set_visible(False)
    for s in ['left', 'bottom']: ax.spines[s].set_color(GRID)
    ax.tick_params(colors=MUTED, labelsize=8.5); ax.set_xlabel('In-game day', color=MUTED, fontsize=8.5)
fig.suptitle('Over 1,000 days, villagers keep changing inside while their relationships set', x=0.06, ha='left', fontsize=12, color=INK)
fig.text(0.06, 0.935, '1,000 villagers (50 hamlets of 20), consensus tables, mean of 5 seeds', fontsize=8.5, color=MUTED)
fig.tight_layout(rect=(0, 0, 1, 0.93))
fig.savefig('figures/fig_longrun.png', facecolor=SURF)
