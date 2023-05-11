import fetch from "node-fetch";
import { secret, SecretType } from "./secret.ts";

class PingCodeOpen{
    // PingCode的API地址
    public static readonly apiHost = "https://open.pingcode.com/v1";

    // https://open.pingcode.com/#api-获取企业令牌
    private adminToken = {
        "expires_in": 0,
        "access_token": "",
        "token_type": ""
    }

    public get headerAuth(){
        return { "authorization": `${this.adminToken.token_type} ${this.adminToken.access_token}` };
    }

    public isAccessTokenExpired = ()=>{
        const now = new Date();
        const expires_in = this.adminToken.expires_in;
        const access_token = this.adminToken.access_token;
        if(expires_in == 0 || access_token == ""){
            return true;
        }
        else{
            const expires = new Date(expires_in);
            return now > expires;
        }
    }
    
    public fetchAccessToken = async(secret: SecretType):Promise<void>=>{
        // 获取企业令牌
        const apiArea = "auth";
        const apiRes = "token";
        const grant_type = "client_credentials";
    
        const url = `${PingCodeOpen.apiHost}/${apiArea}/${apiRes}?grant_type=${grant_type}&client_id=${secret.client_id}&client_secret=${secret.client_secret}`;
        const response = await fetch(url);
        if(response.ok){
            const json = await response.json() as { access_token: string, expires_in: number, token_type: string };
            this.adminToken.access_token = json.access_token;
            this.adminToken.expires_in = json.expires_in;
            this.adminToken.token_type = json.token_type;
        }
        else{
            throw new Error("获取企业令牌失败");
        }
    }
}

const apiHost = PingCodeOpen.apiHost;
const pingCodeOpen = new PingCodeOpen();
await pingCodeOpen.fetchAccessToken(secret);

class ApiPingCode{
    public findWorkItem = async(workItemCode:String)=>{
        const apiArea = "project";
        const apiRes = "work_items";
    
        const url = `${apiHost}/${apiArea}/${apiRes}?identifier=${workItemCode}`;
        return await this.fetchJson(url);
    }
    
    public fetchWorkItemComments = async(workItemId:String, commentId:String)=>{
        const apiArea = "project";
        const apiRes = "work_items";

        const url = `${apiHost}/${apiArea}/${apiRes}/${workItemId}/comments/${commentId}`;
        return await this.fetchJson(url);
    }

    public fetchScm = async()=>{
        const apiArea = "scm";
        const apiRes = "products";

        const url = `${apiHost}/${apiArea}/${apiRes}`;
        return await this.fetchJson(url);
    }

    public createScm = async(name:string, type:string, description:string)=>{
        const apiArea = "scm";
        const apiRes = "products";

        const url = `${apiHost}/${apiArea}/${apiRes}`;
        const data = {name, type, description};
        return await this.postJson(url, data);
    }
    

    private fetchJson = async(url:string)=>{
        const response = await fetch(url, {
            headers: pingCodeOpen.headerAuth
        });
        if(response.ok){
            const json = await response.json();
            return json;
        }
        else{
            console.error(response.status, response.statusText);
            return null;
        }
    }

    private postJson = async(url:string, data:any)=>{
        const response = await fetch(url, {
            method: "POST",
            headers: pingCodeOpen.headerAuth,
            body: JSON.stringify(data)
        });
        if(response.ok){
            const json = await response.json();
            return json;
        }
        else{
            console.error(response.status, response.statusText);
            return null;
        }
    }
}

const apiPingCode = new ApiPingCode();

export {
    apiPingCode
};