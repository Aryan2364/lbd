"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const VERSION_TAG = 'enc:v1:';
const PROD_KEY_PATH = '/etc/secrets/encryption.key';
function loadKey() {
    const raw = (process.env.NODE_ENV === 'production'
        ? (0, node_fs_1.readFileSync)(PROD_KEY_PATH, 'utf8')
        : process.env.ENCRYPTION_KEY ?? '').trim();
    if (!/^[0-9a-fA-F]{64}$/.test(raw))
        throw new Error('Invalid or missing ENCRYPTION_KEY (must be 64 hex chars).');
    return Buffer.from(raw, 'hex');
}
const KEY = loadKey();
function isEnc(v) {
    return typeof v === 'string' && v.startsWith(VERSION_TAG);
}
function enc(plain) {
    const iv = (0, node_crypto_1.randomBytes)(12);
    const cipher = (0, node_crypto_1.createCipheriv)('aes-256-gcm', KEY, iv);
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return VERSION_TAG + Buffer.concat([iv, tag, ct]).toString('base64');
}
function encStr(v) {
    return v ? enc(v) : (v ?? null);
}
function encJson(v) {
    return enc(JSON.stringify(v ?? []));
}
let totalProcessed = 0, totalEncrypted = 0, totalSkipped = 0;
function log(module, id, action) {
    if (action === 'encrypted') {
        console.log(`  [${module}] Encrypted  ${id}`);
        totalEncrypted++;
    }
    else {
        totalSkipped++;
    }
    totalProcessed++;
}
async function main() {
    const prisma = new client_1.PrismaClient();
    try {
        console.log('\n── Goals ──');
        const goals = await prisma.goal.findMany({ include: { notes: true } });
        for (const g of goals) {
            const touched = !isEnc(g.statement) || !isEnc(g.outcome) ||
                !isEnc(g.metric) || !isEnc(g.milestones);
            if (!touched) {
                log('Goal', g.id, 'skipped');
                continue;
            }
            await prisma.goal.update({
                where: { id: g.id },
                data: {
                    statement: isEnc(g.statement) ? g.statement : enc(g.statement),
                    outcome: isEnc(g.outcome) ? g.outcome : encStr(g.outcome),
                    metric: isEnc(g.metric) ? g.metric : encStr(g.metric),
                    milestones: isEnc(g.milestones) ? g.milestones : encJson(g.milestones),
                },
            });
            for (const n of g.notes) {
                if (!isEnc(n.text)) {
                    await prisma.goalNote.update({ where: { id: n.id }, data: { text: enc(n.text) } });
                }
            }
            log('Goal', g.id, 'encrypted');
        }
        console.log('\n── Habits ──');
        const habits = await prisma.habit.findMany();
        for (const h of habits) {
            if (isEnc(h.name) && (h.unit == null || isEnc(h.unit))) {
                log('Habit', h.id, 'skipped');
                continue;
            }
            await prisma.habit.update({
                where: { id: h.id },
                data: {
                    name: isEnc(h.name) ? h.name : enc(h.name),
                    unit: (h.unit && !isEnc(h.unit)) ? enc(h.unit) : h.unit,
                },
            });
            log('Habit', h.id, 'encrypted');
        }
        console.log('\n── Tasks ──');
        const tasks = await prisma.task.findMany();
        for (const t of tasks) {
            if (isEnc(t.title)) {
                log('Task', t.id, 'skipped');
                continue;
            }
            await prisma.task.update({ where: { id: t.id }, data: { title: enc(t.title) } });
            log('Task', t.id, 'encrypted');
        }
        console.log('\n── Event Groups ──');
        const groups = await prisma.eventGroup.findMany();
        for (const g of groups) {
            if (isEnc(g.name)) {
                log('EventGroup', g.id, 'skipped');
                continue;
            }
            await prisma.eventGroup.update({ where: { id: g.id }, data: { name: enc(g.name) } });
            log('EventGroup', g.id, 'encrypted');
        }
        console.log('\n── Week Events ──');
        const events = await prisma.weekEvent.findMany();
        for (const e of events) {
            if (isEnc(e.title) && (e.description == null || isEnc(e.description))) {
                log('WeekEvent', e.id, 'skipped');
                continue;
            }
            await prisma.weekEvent.update({
                where: { id: e.id },
                data: {
                    title: isEnc(e.title) ? e.title : enc(e.title),
                    description: (e.description && !isEnc(e.description)) ? enc(e.description) : e.description,
                },
            });
            log('WeekEvent', e.id, 'encrypted');
        }
        console.log('\n── Week Plans ──');
        const weekPlans = await prisma.weekPlan.findMany();
        for (const p of weekPlans) {
            if (isEnc(p.outcomes) &&
                isEnc(p.doneOutcomes) && isEnc(p.dayNotes)) {
                log('WeekPlan', p.id, 'skipped');
                continue;
            }
            await prisma.weekPlan.update({
                where: { id: p.id },
                data: {
                    outcomes: isEnc(p.outcomes) ? p.outcomes : encJson(p.outcomes),
                    doneOutcomes: isEnc(p.doneOutcomes) ? p.doneOutcomes : encJson(p.doneOutcomes),
                    dayNotes: isEnc(p.dayNotes) ? p.dayNotes : encJson(p.dayNotes),
                },
            });
            log('WeekPlan', p.id, 'encrypted');
        }
        console.log('\n── Evening Reflections ──');
        const evenings = await prisma.eveningReflection.findMany();
        for (const r of evenings) {
            const winsNeedEnc = (r.wins ?? []).some(w => !isEnc(w));
            if (isEnc(r.energyLevel) &&
                (r.mood == null || isEnc(r.mood)) &&
                (r.highlights == null || isEnc(r.highlights)) &&
                (r.gratitude == null || isEnc(r.gratitude)) &&
                isEnc(r.decisions) &&
                !winsNeedEnc &&
                isEnc(r.stuck)) {
                log('EveningReflection', r.id, 'skipped');
                continue;
            }
            await prisma.eveningReflection.update({
                where: { id: r.id },
                data: {
                    energyLevel: isEnc(r.energyLevel) ? r.energyLevel : enc(r.energyLevel),
                    mood: (r.mood && !isEnc(r.mood)) ? enc(r.mood) : r.mood,
                    highlights: (r.highlights && !isEnc(r.highlights)) ? enc(r.highlights) : r.highlights,
                    gratitude: (r.gratitude && !isEnc(r.gratitude)) ? enc(r.gratitude) : r.gratitude,
                    decisions: isEnc(r.decisions) ? r.decisions : encJson(r.decisions),
                    wins: winsNeedEnc ? (r.wins ?? []).map(w => isEnc(w) ? w : enc(w)) : r.wins,
                    stuck: isEnc(r.stuck) ? r.stuck : encJson(r.stuck),
                },
            });
            log('EveningReflection', r.id, 'encrypted');
        }
        console.log('\n── Weekly Reviews ──');
        const reviews = await prisma.weeklyReview.findMany();
        for (const r of reviews) {
            if (isEnc(r.topWins) && isEnc(r.journalSections) &&
                isEnc(r.lifeLessons) && isEnc(r.coreValuesLived) &&
                (r.outcomeNotes == null || isEnc(r.outcomeNotes)) &&
                (r.taskReflection == null || isEnc(r.taskReflection)) &&
                (r.habitReflection == null || isEnc(r.habitReflection)) &&
                (r.journalText == null || isEnc(r.journalText))) {
                log('WeeklyReview', r.id, 'skipped');
                continue;
            }
            await prisma.weeklyReview.update({
                where: { id: r.id },
                data: {
                    topWins: isEnc(r.topWins) ? r.topWins : encJson(r.topWins),
                    outcomeNotes: (r.outcomeNotes && !isEnc(r.outcomeNotes)) ? enc(r.outcomeNotes) : r.outcomeNotes,
                    taskReflection: (r.taskReflection && !isEnc(r.taskReflection)) ? enc(r.taskReflection) : r.taskReflection,
                    habitReflection: (r.habitReflection && !isEnc(r.habitReflection)) ? enc(r.habitReflection) : r.habitReflection,
                    journalText: (r.journalText && !isEnc(r.journalText)) ? enc(r.journalText) : r.journalText,
                    journalSections: isEnc(r.journalSections) ? r.journalSections : encJson(r.journalSections),
                    lifeLessons: isEnc(r.lifeLessons) ? r.lifeLessons : encJson(r.lifeLessons),
                    coreValuesLived: isEnc(r.coreValuesLived) ? r.coreValuesLived : encJson(r.coreValuesLived),
                },
            });
            log('WeeklyReview', r.id, 'encrypted');
        }
        console.log('\n── Bucket Entries ──');
        const bucket = await prisma.bucketEntry.findMany();
        for (const b of bucket) {
            if (isEnc(b.title) && isEnc(b.description) &&
                (!b.imageUrl || isEnc(b.imageUrl)) &&
                (!b.memoryPhotoUrl || isEnc(b.memoryPhotoUrl)) &&
                (b.changeReflection == null || isEnc(b.changeReflection))) {
                log('BucketEntry', b.id, 'skipped');
                continue;
            }
            await prisma.bucketEntry.update({
                where: { id: b.id },
                data: {
                    title: isEnc(b.title) ? b.title : enc(b.title),
                    description: isEnc(b.description) ? b.description : enc(b.description),
                    imageUrl: (b.imageUrl && !isEnc(b.imageUrl)) ? enc(b.imageUrl) : b.imageUrl,
                    memoryPhotoUrl: (b.memoryPhotoUrl && !isEnc(b.memoryPhotoUrl)) ? enc(b.memoryPhotoUrl) : b.memoryPhotoUrl,
                    changeReflection: (b.changeReflection && !isEnc(b.changeReflection)) ? enc(b.changeReflection) : b.changeReflection,
                },
            });
            log('BucketEntry', b.id, 'encrypted');
        }
        console.log('\n── Vision Canvas ──');
        const visions = await prisma.visionCanvas.findMany();
        for (const v of visions) {
            if (isEnc(v.areas) && isEnc(v.purposeStatement)) {
                log('VisionCanvas', v.id, 'skipped');
                continue;
            }
            await prisma.visionCanvas.update({
                where: { id: v.id },
                data: {
                    areas: isEnc(v.areas) ? v.areas : encJson(v.areas),
                    purposeStatement: isEnc(v.purposeStatement) ? v.purposeStatement : enc(v.purposeStatement),
                },
            });
            log('VisionCanvas', v.id, 'encrypted');
        }
        console.log('\n── Legacy Canvas ──');
        const legacies = await prisma.legacyCanvas.findMany();
        for (const l of legacies) {
            const roles = l.roleTexts ?? {};
            const rolesNeedEnc = Object.values(roles).some(v => !isEnc(v));
            if (!rolesNeedEnc && isEnc(l.purposeText)) {
                log('LegacyCanvas', l.id, 'skipped');
                continue;
            }
            const nextRoles = {};
            for (const [k, v] of Object.entries(roles)) {
                nextRoles[k] = isEnc(v) ? v : enc(v);
            }
            await prisma.legacyCanvas.update({
                where: { id: l.id },
                data: {
                    roleTexts: nextRoles,
                    purposeText: isEnc(l.purposeText) ? l.purposeText : enc(l.purposeText),
                },
            });
            log('LegacyCanvas', l.id, 'encrypted');
        }
        console.log('\n── Support Tickets ──');
        const tickets = await prisma.supportTicket.findMany();
        for (const t of tickets) {
            if (isEnc(t.subject) && isEnc(t.messages)) {
                log('SupportTicket', t.id, 'skipped');
                continue;
            }
            await prisma.supportTicket.update({
                where: { id: t.id },
                data: {
                    subject: isEnc(t.subject) ? t.subject : enc(t.subject),
                    messages: isEnc(t.messages) ? t.messages : encJson(t.messages),
                },
            });
            log('SupportTicket', t.id, 'encrypted');
        }
    }
    finally {
        await prisma.$disconnect();
    }
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Migration complete.`);
    console.log(`  processed : ${totalProcessed}`);
    console.log(`  encrypted : ${totalEncrypted}`);
    console.log(`  skipped   : ${totalSkipped}`);
}
main().catch(e => {
    console.error('\nMigration failed:', e.message);
    process.exit(1);
});
//# sourceMappingURL=encrypt-all-existing.js.map