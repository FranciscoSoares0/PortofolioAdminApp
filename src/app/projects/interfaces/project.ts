export interface Project {
    _id?:string;
    name: string;
    description: string;
    gitHubLink: string;
    techs : Array<string>;
    images: Array<string>;
}
