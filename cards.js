let cards = [
  {
    id: 'pikemen',
    type: 'attack',
    title: '攻击',
    description: '消耗 1 <b>体力</b><br>造成 1 <b>伤害</b>',
    note: '等价交换.',
    play(player, opponent) {
      player.food -= 1
      opponent.health -= 1
    },
  },
  {
    id: 'catapult',
    type: 'attack',
    title: '2V2',
    description: '消耗 2 <b>体力</b><br>造成 2 <b>伤害</b>',
    play(player, opponent) {
      player.food -= 2
      opponent.health -= 2
    },
  },
  {
    id: 'trebuchet',
    type: 'attack',
    title: '3V4',
    description: '消耗 3 <b>体力</b><br>受到 1 <b>伤害</b><br>造成 4 <b>伤害</b>',
    note: ' &#171;最好的机制!&#187;',
    play(player, opponent) {
      player.food -= 3
      player.health -= 1
      opponent.health -= 4
    },
  },
  {
    id: 'archers',
    type: 'attack',
    title: '3V3',
    description: '消耗 3 <b>体力</b><br>造成 3 <b>伤害</b>',
    note: '&#171;开弓没有回头箭&#187;',
    play(player, opponent) {
      player.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'knighthood',
    type: 'attack',
    title: '亏本攻击',
    description: '消耗 7 <b>体力</b><br>造成 5 <b>伤害</b>',
    note: '伤敌一万自损八千.',
    play(player, opponent) {
      player.food -= 7
      opponent.health -= 5
    },
  },
  {
    id: 'repair',
    type: 'support',
    title: '回血',
    description: '修复 5 <b>伤害</b><br>下把跳过！',
    play(player, opponent) {
      player.skipTurn = true
      player.health += 5
    }
  },
  {
    id: 'quick-repair',
    type: 'support',
    title: '快速修复',
    description: '消耗 3 <b>体力</b><br>修复 3 <b>伤害</b>',
    note: '好像什么也没干!',
    play(player, opponent) {
      player.food -= 3
      player.health += 3
    }
  },
  {
    id: 'farm',
    type: 'support',
    title: '养精蓄锐',
    description: '获取 5 <b>体力</b><br>跳过下个回合!',
    note: '&#171;好好休戚,鸣金收兵！.&#187;',
    play(player, opponent) {
      player.skipTurn = true
      player.food += 5
    },
  },
  {
    id: 'granary',
    type: 'support',
    title: '恢复',
    description: '获取 2 <b>体力</b>',
    play(player, opponent) {
      player.food += 2
    }
  },
  {
    id: 'poison',
    type: 'special',
    title: '一起挨饿',
    description: '消耗 1 <b>体力</b><br>你的对手消耗 3 <b>体力</b>',
    note: '兵马未动粮草先行！.',
    play(player, opponent) {
      player.food -= 1
      opponent.food -= 3
    },
  },
  {
    id: 'fireball',
    type: 'special',
    title: '火球攻击',
    description: '造成 3 <b>伤害</b><br>造成 5 <b>伤害</b><br>跳过你的回合！',
    note: '&#171;Magic isn\'t for kids. You fool.&#187;',
    play(player, opponent) {
      player.health -= 3
      player.skipTurn = true
      opponent.health -= 5
    },
  },
  {
    id: 'chapel',
    type: 'special',
    title: '开摆',
    description: '摆',
    note: '祈祷一回合.',
    play(player, opponent) {
      // Nothing happens...
    },
  },
  {
    id: 'curse',
    type: 'special',
    title: '祸从天降',
    description: '每个人:<br>丢掉 3 <b>体力</b><br>受到 3 <b>伤害</b>',
    play(player, opponent) {
      player.food -= 3
      player.health -= 3
      opponent.food -= 3
      opponent.health -= 3
    },
  },
  {
    id: 'miracle',
    type: 'special',
    title: '天降正义',
    description: '每个人:<br>获取 3 <b>体力</b><br>修复 3 <b>伤害</b>',
    play(player, opponent) {
      player.food += 3
      player.health += 3
      opponent.food += 3
      opponent.health += 3
    },
  },
]
//这边这个后面的图标还有点不会
cards = cards.reduce((map, card) => {
  card.description = card.description.replace(/\d+\s+<b>.*?<\/b>/gi, '<span class="effect">$&</span>')
  card.description = card.description.replace(/<b>(.*?)<\/b>/gi, (match, p1) => {
    let id = p1.toLowerCase()

    // // const id = "food";
    switch (id) {
      case "体力": id = "food"; break;
      case "伤害": id = "damage"; break;
      default: break;
    }
    return `<b class="keyword ${id}">${p1} <img src="svg/${id}.svg"/></b>`
  })
  map[card.id] = card
  return map
}, {})

let pile = {
  pikemen: 4,
  catapult: 4,
  trebuchet: 3,
  archers: 3,
  knighthood: 3,
  'quick-repair': 4,
  granary: 4,
  repair: 3,
  farm: 3,
  poison: 2,
  fireball: 2,
  chapel: 2,
  curse: 1,
  miracle: 1,
}
