# Judging villager behaviour

You are judging a small village simulation. Each item below describes a villager at one moment: their personality, beliefs, mood and recent history with another villager. Then it lists two or more possible things the villager does or feels next.

For each option, rate how believable it is for this particular villager in this situation, from 1 (makes no sense for them) to 5 (exactly what I'd expect). Judge each option on its own. Options can get the same score. There is no trick and no single correct answer.

Possible acts: in the field help, chat, take credit (claim someone else's work) or argue; in the square chat, praise, share food, interrupt, ignore or argue. Rooms: home (eat or rest), field (work), square (socialise). Reactions: what the event means to them (good sign, nothing much, slight, insult) and whether their liking for the other villager goes up, stays the same or goes down.

Reply with this first line:
model: <your model name and version, if you know it>

Then ONLY a CSV in a code block, one row per option, with the header:
item,option,score

**J01.** Day 11, hour 3 of 16. Villager n0007 feels fine. Personality: warmth high, sociability high, diligence mid, honesty high, pride high. Beliefs: "people mean well" (firmly); "i am respected" (deeply, as part of who they are); "nothing i do matters" (faintly). Mood right now: calm.
  A. goes to the square
  B. goes to the field

**J02.** Day 22, hour 2 of 16. Villager n0003 feels fine. Personality: warmth high, sociability mid, diligence low, honesty low, pride mid. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (firmly); "nothing i do matters" (faintly). Mood right now: calm.
  A. goes to the square
  B. goes to the home

**J03.** Day 12, hour 2 of 16. Villager n0010 feels fine. Personality: warmth mid, sociability low, diligence low, honesty mid, pride high. Beliefs: "people are against me" (faintly); "i am overlooked" (faintly); "hard work pays off" (faintly). Mood right now: calm.
  A. goes to the home
  B. goes to the field

**J04.** Day 10. Villager n0012 meets n0001 in the field. Personality: warmth mid, sociability mid, diligence high, honesty low, pride mid. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (faintly); "nothing i do matters" (faintly). Mood right now: calm. n0012 likes n0001. Recent history between them: day 7, n0012 helped n0001; day 7, n0012 helped n0001; day 9, n0012 helped n0001.
  A. chooses to chat
  B. chooses to help

**J05.** Day 17. Villager n0016 meets n0002 in the square. Personality: warmth mid, sociability high, diligence high, honesty low, pride mid. Beliefs: "people mean well" (deeply, as part of who they are); "i am respected" (faintly); "hard work pays off" (deeply, as part of who they are). Mood right now: calm. n0016 is close to n0002. Recent history between them: day 16, n0002 helped n0016; day 16, n0002 helped n0016; day 17, n0016 praised n0002.
  A. chooses to praise
  B. chooses to chat

**J06.** Day 9. Villager n0015 meets n0017 in the field. Personality: warmth mid, sociability mid, diligence mid, honesty high, pride low. Beliefs: "people are against me" (faintly); "i am respected" (faintly); "hard work pays off" (faintly). Mood right now: calm. n0015 feels neutral about n0017. Recent history between them: day 8, n0017 chatted with n0015; day 8, n0015 chatted with n0017; day 8, n0017 helped n0015.
  A. chooses to help
  B. chooses to chat

**J07.** Day 9. Villager n0010 meets n0018 in the field. Personality: warmth mid, sociability low, diligence low, honesty mid, pride high. Beliefs: "people are against me" (faintly); "i am overlooked" (faintly); "hard work pays off" (faintly). Mood right now: calm. n0010 feels neutral about n0018. Recent history between them: day 8, n0010 helped n0018.
  A. chooses to chat
  B. chooses to help

**J08.** Day 14. Villager n0008 meets n0007 in the field. Personality: warmth low, sociability low, diligence high, honesty low, pride high. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (deeply, as part of who they are); "hard work pays off" (deeply, as part of who they are). Mood right now: low. n0008 feels neutral about n0007. Recent history between them: day 7, n0007 chatted with n0008; day 11, n0007 chatted with n0008; day 11, n0008 chatted with n0007.
  A. chooses to help
  B. chooses to argue
  C. chooses to take credit

**J09.** Day 24. Villager n0008 meets n0017 in the field. Personality: warmth low, sociability low, diligence high, honesty low, pride high. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (deeply, as part of who they are); "hard work pays off" (deeply, as part of who they are). Mood right now: good. n0008 feels neutral about n0017 and is holding a grudge (hold grudge). Recent history between them: day 22, n0017 helped n0008; day 23, n0017 chatted with n0008; day 24, n0008 chatted with n0017.
  A. chooses to argue
  B. chooses to chat

**J10.** Day 10. Villager n0008 meets n0012 in the field. Personality: warmth low, sociability low, diligence high, honesty low, pride high. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (deeply, as part of who they are); "hard work pays off" (deeply, as part of who they are). Mood right now: calm. n0008 feels neutral about n0012 and is holding a grudge (pay back). Recent history between them: day 8, n0008 chatted with n0012; day 9, n0012 took credit for the work of n0008; day 9, n0012 helped n0008.
  A. chooses to argue
  B. chooses to take credit

**J11.** Day 12. n0014 just praised n0006. About n0006: Personality: warmth high, sociability mid, diligence high, honesty low, pride low. Beliefs: "people mean well" (firmly); "i am overlooked" (firmly); "hard work pays off" (faintly). Mood right now: calm. Before this, n0006 feels neutral about n0014. Recent history between them: day 5, n0006 chatted with n0014; day 8, n0014 chatted with n0006; day 11, n0014 chatted with n0006.
  A. takes it as "nothing much"; liking stays the same
  B. takes it as "good sign"; liking goes up

**J12.** Day 17. n0009 just praised n0005. About n0005: Personality: warmth high, sociability high, diligence low, honesty high, pride mid. Beliefs: "people mean well" (firmly); "i am respected" (deeply, as part of who they are); "nothing i do matters" (faintly). Mood right now: calm. Before this, n0005 is close to n0009. Recent history between them: day 16, n0009 chatted with n0005; day 17, n0009 praised n0005; day 17, n0009 chatted with n0005.
  A. takes it as "good sign"; liking goes up
  B. takes it as "good sign"; liking stays the same

**J13.** Day 16. n0008 just took credit for n0001's work. About n0001: Personality: warmth high, sociability low, diligence mid, honesty mid, pride low. Beliefs: "people mean well" (deeply, as part of who they are); "i am overlooked" (firmly); "hard work pays off" (firmly). Mood right now: calm. Before this, n0001 likes n0008. Recent history between them: day 12, n0001 helped n0008; day 12, n0001 helped n0008; day 14, n0008 took credit for the work of n0001.
  A. takes it as "slight"; liking goes down
  B. takes it as "insult"; liking goes down

**J14.** Day 19. n0012 just helped n0015 with n0015's work. About n0015: Personality: warmth mid, sociability mid, diligence mid, honesty high, pride low. Beliefs: "people are against me" (faintly); "i am respected" (faintly); "hard work pays off" (faintly). Mood right now: calm. Before this, n0015 is close to n0012. Recent history between them: day 18, n0012 helped n0015; day 18, n0015 helped n0012; day 18, n0012 took credit for the work of n0015.
  A. takes it as "good sign"; liking goes up
  B. takes it as "slight"; liking stays the same

**J15.** Day 24. n0018 just took credit for n0013's work. About n0013: Personality: warmth low, sociability low, diligence low, honesty mid, pride mid. Beliefs: "people are against me" (firmly); "i am overlooked" (faintly); "nothing i do matters" (faintly). Mood right now: calm. Before this, n0013 likes n0018. Recent history between them: day 17, n0013 chatted with n0018; day 17, n0013 helped n0018; day 22, n0013 chatted with n0018.
  A. takes it as "slight"; liking goes down
  B. takes it as "insult"; liking goes down

**J16.** Day 11. n0012 just ignored n0019. About n0019: Personality: warmth high, sociability high, diligence low, honesty high, pride high. Beliefs: "people mean well" (firmly); "i am respected" (deeply, as part of who they are); "nothing i do matters" (faintly). Mood right now: calm. Before this, n0019 likes n0012. Recent history between them: day 7, n0012 chatted with n0019; day 8, n0012 chatted with n0019; day 8, n0012 ignored n0019.
  A. takes it as "insult"; liking goes down
  B. takes it as "slight"; liking goes down

**J17.** Day 17. n0008 just argued with n0003. About n0003: Personality: warmth high, sociability low, diligence low, honesty low, pride mid. Beliefs: "people mean well" (firmly); "i am overlooked" (firmly); "nothing i do matters" (faintly). Mood right now: calm. Before this, n0003 feels neutral about n0008. Recent history between them: day 11, n0008 chatted with n0003; day 14, n0003 helped n0008.
  A. takes it as "slight"; liking goes down
  B. takes it as "insult"; liking goes down

**J18.** Day 26. n0015 just argued with n0016. About n0016: Personality: warmth mid, sociability high, diligence high, honesty low, pride mid. Beliefs: "people mean well" (deeply, as part of who they are); "i am respected" (faintly); "hard work pays off" (deeply, as part of who they are). Mood right now: calm. Before this, n0016 is close to n0015. Recent history between them: day 24, n0015 chatted with n0016; day 24, n0015 chatted with n0016; day 25, n0015 helped n0016.
  A. takes it as "slight"; liking goes down
  B. takes it as "insult"; liking goes down
