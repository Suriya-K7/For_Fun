function maxProfitSchedule(n) {
  const BUILD_TIME = { T: 5, P: 4, C: 10 };
  const EARNING = { T: 1500, P: 1000, C: 3000 };

  const dp = new Array(n + 1).fill(0);
  const choice = new Array(n + 1).fill("N");

  function safeDP(x) {
    return x >= 0 ? dp[x] : 0;
  }

  for (let t = 1; t <= n; t++) {
    dp[t] = dp[t - 1];
    choice[t] = "N";

    if (t >= BUILD_TIME.T) {
      const finishTProfit = safeDP(t - BUILD_TIME.T) + (n - t) * EARNING.T;
      if (finishTProfit > dp[t]) {
        dp[t] = finishTProfit;
        choice[t] = "T";
      }
    }

    if (t >= BUILD_TIME.P) {
      const finishPProfit = safeDP(t - BUILD_TIME.P) + (n - t) * EARNING.P;
      if (finishPProfit > dp[t]) {
        dp[t] = finishPProfit;
        choice[t] = "P";
      }
    }

    if (t >= BUILD_TIME.C) {
      const finishCProfit = safeDP(t - BUILD_TIME.C) + (n - t) * EARNING.C;
      if (finishCProfit > dp[t]) {
        dp[t] = finishCProfit;
        choice[t] = "C";
      }
    }
  }

  let schedule = [];
  let t = n;
  while (t > 0) {
    if (choice[t] === "N") {
      t--;
    } else {
      const prop = choice[t];
      schedule.unshift(prop);
      t -= BUILD_TIME[prop];
    }
  }

  const counts = { T: 0, P: 0, C: 0 };
  schedule.forEach((prop) => counts[prop]++);

  const scheduleString = `T:${counts.T} P:${counts.P} C:${counts.C}`;

  return {
    n,
    maxProfit: dp[n],
    schedule: schedule,
    summary: scheduleString,
  };
}

console.log(maxProfitSchedule(7));

console.log(maxProfitSchedule(8));

console.log(maxProfitSchedule(13));
