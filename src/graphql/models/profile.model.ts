import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Link } from './link.model';
import { Skill } from './skill.model';
import { Experience } from './experience.model';
import { Project } from './project.model';

@ObjectType()
export class Profile {
    @Field(() => Int)
    id: number;

    @Field()
    fullName: string;

    @Field()
    description: string;

    @Field(() => [Link])
    links: Link[];

    @Field(() => [Skill])
    skills: Skill[];

    @Field(() => [Experience])
    experiences: Experience[];

    @Field(() => [Project])
    projects: Project[];
}