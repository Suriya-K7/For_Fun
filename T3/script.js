function maxProfitSchedule(n) {
  const BUILD_TIME = { T: 5, P: 4, C: 10 };
  const EARNING = { T: 1500, P: 1000, C: 3000 };
  const TYPES = ["T", "P", "C"];

  const dp = Array.from({ length: n + 1 }, () => ({ profit: 0, prev: [] }));

  for (let t = 1; t <= n; t++) {
    let bestProfit = dp[t - 1].profit;
    let bestPrev = [{ prevTime: t - 1, built: null }];

    for (const k of TYPES) {
      const bt = BUILD_TIME[k];
      if (t < bt) continue;
      const cand = dp[t - bt].profit + (n - t) * EARNING[k];

      if (cand > bestProfit) {
        bestProfit = cand;
        bestPrev = [{ prevTime: t - bt, built: k }];
      } else if (cand === bestProfit) {
        bestPrev.push({ prevTime: t - bt, built: k });
      }
    }
    dp[t] = { profit: bestProfit, prev: bestPrev };
  }

  const mixes = [];

  function backtrack(time, counts) {
    if (time === 0) {
      mixes.push({ ...counts });
      return;
    }
    for (const step of dp[time].prev) {
      if (step.built === null) {
        backtrack(step.prevTime, counts);
      } else {
        counts[step.built]++;
        backtrack(step.prevTime, counts);
        counts[step.built]--;
      }
    }
  }

  backtrack(n, { T: 0, P: 0, C: 0 });

  // Keep only solutions with minimal total project count
  const unique = {};
  let minProjects = Infinity;

  for (const m of mixes) {
    const totalProjects = m.T + m.P + m.C;
    const key = `${m.T}-${m.P}-${m.C}`;
    if (totalProjects <= minProjects) {
      unique[key] = m;
      if (totalProjects < minProjects) {
        minProjects = totalProjects;
      }
    }
  }

  const solutions = Object.values(unique).filter(
    (m) => m.T + m.P + m.C === minProjects
  );

  return {
    n,
    maxProfit: dp[n].profit,
    solutions,
    summaries: solutions.map((m) => `T:${m.T} P:${m.P} C:${m.C}`),
  };
}

// Test cases
[7, 8, 13, 49].forEach((n) => {
  const result = maxProfitSchedule(n);
  console.log(`\n--- n = ${n} ---`);
  console.log("Max Profit:", result.maxProfit);
  console.log("Solutions:", result.solutions);
  console.log("Summaries:", result.summaries);
});
