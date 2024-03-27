export interface userReq {
    user_id:  number;
    username: string;
    Email:    string;
    Password: string;
    picture:  string;
    type:     string;
}
//ต้องครบทุกตัว ใน db
export interface imagereq {
    image_id:   number;
    image_url:  string;
    user_id:    number;
    current_score: number;
}


export interface scorereq {
    score:   number;
    vote_date: Date;
    image_id: number;
}
export interface imageReq {
    score:     number;
    vote_date: Date;
    image_id:  number;
}

export interface imageId {
    user_id:  number;
    image_url: string;
}

export interface votereq { ///-----------
    user_id:  number;
    image_url: string;
    score:   number;
    vote_date: Date;
    image_id: number;
    current_score: number;

}