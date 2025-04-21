export interface Project {
    _id?:string;
    name: string;
    description: string;
    gitHubLink: string;
    appLink?: string;
    techs : Array<string>;
    images: Array<string>;
}
