const processForwards = (forwards, msg) => {
  const sortedForwards = forwards.sort((first, second) => {
    if (first.date < second.date) {
      return -1;
    }
    if (first.date > second.date) {
      return 1;
    }
    return 0;
  });

  const groupForwards = (_forwards) => {
    const groups = [];
    const TIME_DIFF_FACTOR = 50;
    let PROCESS_ALLOWED = true;
    let groupIndex = 0;
    let initialTimeFrame = _forwards[0].date;
    let lastTimeFrame = initialTimeFrame + TIME_DIFF_FACTOR;

    _forwards.forEach((forward, index) => {
      if (PROCESS_ALLOWED) {
        if (!groups[groupIndex]) {
          groups[groupIndex] = [];
        }

        if (forward.date >= initialTimeFrame && forward.date <= lastTimeFrame) {
          groups[groupIndex].push(forward);
        } else {
          const nextEntry = _forwards[index + 1];
          if (nextEntry) {
            groupIndex += 1;
            initialTimeFrame = nextEntry.date;
            lastTimeFrame = initialTimeFrame + TIME_DIFF_FACTOR;
            groups[groupIndex] = [forward];
          } else {
            groupIndex += 1;
            groups[groupIndex] = [forward];
            PROCESS_ALLOWED = false;
          }
        }
      }
    });

    return groups;
  };

  const groupedForwards = groupForwards(sortedForwards);

  const processedGroups = groupedForwards.map((group) => {
    if (group.length === 0) {
      return {
        ignore: true,
      };
    }

    const pipsInGroup = group.filter(entry => entry.type === 'pipboy').length;
    const signupsInGroup = group.filter(entry => entry.type === 'signUpMessage').length;

    if (pipsInGroup === 1 && signupsInGroup === 1) {
      const pip = group.find(entry => entry.type === 'pipboy');
      const signUp = group.find(entry => entry.type === 'signUpMessage');

      const distance = pip.isInWasteland ? pip.distance - 1 : pip.distance;

      return {
        name: signUp.name,
        forwards: {
          hpCurrent: pip.healthActual,
          hpMax: pip.healthMax,
          damage: pip.damage,
          armor: pip.armor,
          strength: pip.strength,
          precision: pip.precision,
          charisma: pip.charisma,
          agility: pip.agility,
          endurance: pip.endurance,
          time: pip.date,
          stamp: `${pip.date}${msg.from.id}`,
          distance,
          user: {
            username: msg.from.username,
            id: msg.from.id,
          },
        },
      };
    }

    return {
      ignore: true,
    };
  });

  return processedGroups;
};

module.exports = processForwards;
