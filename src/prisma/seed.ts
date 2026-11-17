// oxlint-disable-next-line import/no-unassigned-import
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../prisma/generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed (): Promise<void> {
    await prisma.link.deleteMany();
    await prisma.project.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.profile.deleteMany();

    const profile = await prisma.profile.create({
        data: {
            fullName: 'Шитиков Никита',
            description: 'JavaScript-разработчик с опытом 3+ лет. Специализируюсь на JavaScript-фреймворках, Node.js, NestJS и React',
            links: {
                create: [
                    { resource: 'GitHub', url: 'https://github.com/gomeliGithub' },
                    { resource: 'LinkedIn', url: 'https://www.linkedin.com/in/%D0%BD%D0%B8%D0%BA%D0%B8%D1%82%D0%B0-%D1%88%D0%B8%D1%82%D0%B8%D0%BA%D0%BE%D0%B2-4500b2448'},
                    { resource: 'Telegram', url: 'https://t.me/gomeli_tg' }
                ]
            },
            skills: {
                create: [
                    { name: 'JavaScript', level: 3 },
                    { name: 'TypeScript', level: 3 },
                    { name: 'Node.js', level: 3 },
                    { name: 'Angular', level: 2 },
                    { name: 'React', level: 2 },
                    { name: 'Next.js', level: 2 },
                    { name: 'MySQL', level: 2 }
                ]
            },
            experiences: {
                create: [
                    {
                        company: 'Green',
                        position: 'Security Guy',
                        startDate: new Date('2021-11-11'),
                        endDate: new Date('2026-11-11'),
                        achievements: null
                    }
                ]
            },
            projects: {
                create: [
                    {
                        name: 'Photographer Project',
                        link: 'https://github.com/gomeliGithub/photographer-project',
                        description: 'Web application to assist photographer work',
                        technologies: 'Nest.js, Angular, Prisma ORM, MySQL'
                    },
                    {
                        name: 'Admissions Committee Project',
                        link: 'https://github.com/gomeliGithub/admissions-committee-project',
                        description: 'Web application to support admissions committee work as university coursework project',
                        technologies: 'Python with FastAPI, Angular + SSR, Prisma ORM, MySQL'
                    },
                    {
                        name: 'User Authentication And Task Creation App',
                        link: 'https://github.com/gomeliGithub/userAuthenticationAndTaskCreationApp',
                        description: 'Web application for user task creation as university coursework project',
                        technologies: 'Angular + SSR, Prisma ORM, MySQL'
                    }
                ]
            }
        }
    });

    console.log('Database seeded successfully: ', profile.fullName);
}

seed().then(async () => {
    await prisma.$disconnect();
    await pool.end();
}).catch(async (e) => {
    console.error(e);
    
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
});