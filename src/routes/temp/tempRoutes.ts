import { Request, Response } from 'express';


export const login = (req: Request, res: Response) => {
    req.session['userId'] = 'tsk';
    res.send('Are you serious?!');
}

export const auth = (req: Request, res: Response) => {
    if (!req.session || !req.session.id) res.send('You shall not pass!');
    res.json(req.session);
}