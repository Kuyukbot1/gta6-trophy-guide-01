// Rendering: the checklist, the trophy detail pane, and the roadmap /
// missables / sources pages, all built from the loaded data.
import { KIND_NAMES, spoilerHides } from './filters.js';

const GRADE_MARK = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function medalDot(trophy) {
  const dot = node('span', `medal ${trophy.grade}`, GRADE_MARK[trophy.grade]);
  dot.title = trophy.grade;
  return dot;
}

function tagStrip(trophy) {
  const row = node('div', 'trophy-tags');
  row.append(node('span', 'tag', KIND_NAMES[trophy.kind] ?? trophy.kind));
  if (trophy.target) row.append(node('span', 'tag target', `Target: ${trophy.target}`));
  if (trophy.missable) row.append(node('span', 'tag missable', 'Missable'));
  return row;
}

export function paintChecklist(listNode, metaNode, trophies, ui, done, openId, onSelect, onToggle) {
  listNode.replaceChildren();
  for (const trophy of trophies) {
    const hidden = spoilerHides(trophy, done, ui.spoiler);
    const isEarned = done.has(trophy.id);
    const li = node(
      'li',
      'trophy' + (isEarned ? ' earned' : '') + (trophy.id === openId ? ' selected' : ''),
    );
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${hidden ? 'story trophy' : trophy.name} earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id, box.checked);
    });
    const name = node('div', 'trophy-name');
    if (hidden) {
      name.append(node('span', 'hidden-name', 'Hidden story trophy — earn it to reveal it'));
    } else {
      name.textContent = trophy.name;
    }
    const desc = node('div', 'trophy-desc', hidden ? 'Spoiler-free mode is hiding this story trophy.' : trophy.description);
    const text = node('div');
    text.append(name, desc, tagStrip(trophy));
    const grade = node('div', 'trophy-grade', trophy.grade);
    if (isEarned) grade.append(node('span', 'earned-mark', 'Earned'));
    li.append(box, medalDot(trophy), text, grade);
    li.addEventListener('click', () => onSelect(trophy.id));
    listNode.append(li);
  }
  const shown = trophies.length;
  metaNode.textContent = shown === 0
    ? 'No trophies match these filters.'
    : `Showing ${shown} of 55 trophies · ${done.size} earned`;
}

export function paintDetail(detailNode, trophy, sources, done, spoilerOn, onToggle) {
  detailNode.replaceChildren();
  if (!trophy) {
    detailNode.append(node('p', 'detail-empty', 'Pick a trophy on the left to see its guide, sources and missable notes.'));
    return;
  }
  const hidden = spoilerHides(trophy, done, spoilerOn);
  const head = node('div');
  head.append(medalDot(trophy));
  head.append(node('h2', undefined, hidden ? 'Hidden story trophy' : trophy.name));
  head.append(node('p', 'official', hidden ? 'Spoiler-free mode is on.' : `Official: “${trophy.description}” — ${trophy.grade}`));
  detailNode.append(head);
  detailNode.append(tagStrip(trophy));
  if (hidden) {
    detailNode.append(node(
      'p',
      'spoiler-mask',
      'This is a story trophy and spoiler-free mode is on. Its name, description and guide stay hidden until you earn it — tick it off in the checklist to reveal it.',
    ));
  } else {
    detailNode.append(node('h3', undefined, 'How to earn it'));
    detailNode.append(node('p', 'guide-text', trophy.guide));
    detailNode.append(node('h3', undefined, 'Sources'));
    const list = node('ul', 'sources');
    for (const key of trophy.sources) {
      const source = sources[key];
      if (!source) continue;
      const item = node('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.name;
      item.append(link, document.createTextNode(` — ${source.usedFor}`));
      list.append(item);
    }
    detailNode.append(list);
  }
  const actions = node('div', 'detail-actions');
  const toggle = node('button', undefined, done.has(trophy.id) ? 'Mark as not earned' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => onToggle(trophy.id, !done.has(trophy.id)));
  actions.append(toggle);
  detailNode.append(actions);
}

export function paintRoadmap(pageNode, plan) {
  pageNode.replaceChildren();
  pageNode.append(node('h2', undefined, 'Roadmap to the platinum'));
  pageNode.append(node('p', undefined, plan.note));
  const facts = node('div', 'fact-grid');
  for (const fact of plan.facts) {
    const cell = node('div', 'fact');
    cell.append(node('b', undefined, fact.label), document.createTextNode(fact.value));
    facts.append(cell);
  }
  pageNode.append(facts);
  for (const stage of plan.stages) {
    const card = node('div', 'stage');
    card.append(node('h3', undefined, `Step ${stage.step}: ${stage.title}`));
    card.append(node('p', 'hours', stage.hours));
    const list = node('ul');
    for (const detail of stage.details) list.append(node('li', undefined, detail));
    card.append(list);
    pageNode.append(card);
  }
}

export function paintMissables(pageNode, trophies) {
  pageNode.replaceChildren();
  pageNode.append(node('h2', undefined, 'Missable trophies'));
  const missables = trophies.filter((trophy) => trophy.missable);
  pageNode.append(node(
    'p',
    undefined,
    `Of the 55 trophies, ${missables.length === 1 ? 'only 1 is potentially missable' : `${missables.length} are missable`}. Everything else can be earned after the story in free-roam.`,
  ));
  for (const trophy of missables) {
    const card = node('div', 'missable-card');
    card.append(node('h3', undefined, `${trophy.name} — ${trophy.grade}`));
    card.append(node('p', 'official', `Official: “${trophy.description}”`));
    card.append(node('p', undefined, trophy.guide));
    pageNode.append(card);
  }
  const callout = node('div', 'callout');
  callout.append(node('p', undefined, 'Save strategy: the game has 15 manual save slots and no mission replay. Keep a save at the start and end of each chapter, and rotate the rest for free-roam clean-up. Never turn cheats on in your platinum save — cheats disable trophies and saving (PowerPyx).'));
  pageNode.append(callout);
  pageNode.append(node('h3', undefined, 'What is NOT missable'));
  pageNode.append(node('p', undefined, 'Optional missions that disappear, quest givers who go quiet for a while, fences that close, and magazine collectibles in story buildings — PowerPyx confirms none of these affect trophies or 100% completion. Strangers & Freaks, all trophy questlines and every checklist item are still there after the story.'));
}

export function paintSources(pageNode, sources) {
  pageNode.replaceChildren();
  pageNode.append(node('h2', undefined, 'Sources'));
  pageNode.append(node('p', undefined, 'Every guide in this app is written in our own words. Facts come from the sources below; the official trophy names, descriptions and grades are shown exactly as PlayStation publishes them.'));
  const list = node('ul');
  for (const source of Object.values(sources)) {
    const item = node('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link, document.createTextNode(` — ${source.usedFor}`));
    list.append(item);
  }
  pageNode.append(list);
  pageNode.append(node('h3', undefined, 'What we did not do'));
  pageNode.append(node('p', undefined, 'No guide text was copied from another guide, and no Rockstar artwork, logo or game screenshot is used anywhere in this app. Where a method is still being confirmed by the community (for example which exact animal pops Fair Game, or whether the Chapter 1 meditation counts toward Positive Mental Attitude), the guide says so plainly instead of guessing.'));
}
