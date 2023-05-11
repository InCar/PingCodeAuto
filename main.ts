import { apiPingCode } from "./apiPingCode.ts";

const workItem = await apiPingCode.findWorkItem("APOW-14");
console.info(workItem);
// const comments = await apiPingCode.fetchWorkItemComments("6440e9a5ddba7cfcfa00a8ed", "645cc5290e193e5f39de55c6");

/*let scm = await apiPingCode.fetchScm();
console.info(scm);

const scmGitLab = await apiPingCode.createScm("GitLab", "gitlab", "https://gitlab.incarcloud.com/");
console.info(scmGitLab);

scm = await apiPingCode.fetchScm();
console.info(scm);*/