



export interface LoginRequest{
    username: string;
    password: string;
}

export interface LoginResponse{  
    token: string;  
    user : User;
    expiresIn: number;
}

export interface User{
    id: number;
    username: string;
    displayName: string;
    role: 'admin' | 'viewer' | 'operator';
    avatar?: string;
}