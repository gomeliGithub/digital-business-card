import { type Prisma, type Link, type Skill, type Experience, type Project, type Profile } from "@/prisma/generated/prisma/client";

type FullProfilePayload = Prisma.ProfileGetPayload<{
    include: {
        links: true;
        skills: true;
        experiences: true;
        projects: true;
    };
}>;

export interface IProfileWithRelations extends Profile, Partial<Pick<FullProfilePayload, 'links' | 'skills' | 'experiences' | 'projects'>> { }
export interface ILink extends Link { }
export interface ISkill extends Skill { }
export interface IExperience extends Experience { }
export interface IProject extends Project { }

export type TPrismaProfileSelect = {
    [key: string]: boolean | { select: TPrismaProfileSelect };
};