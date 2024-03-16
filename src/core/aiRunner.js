import OpenAI from 'openai';

const keyForAPIKey = "openAIKey";

export function getAPIKey(){
    return localStorage.getItem(keyForAPIKey);
}

export function deleteAPIKey(){
    localStorage.removeItem(keyForAPIKey)
}

function getOpenAIClient(){
    return  new OpenAI({
        apiKey: getAPIKey(),
        dangerouslyAllowBrowser: true
    });
}

export function getReplyString(completions){
    return completions.choices[0]?.message?.content;
}

export async function runSimpleUserPrompt(userPrompt, model) {
    if (userPrompt === ""){
        return null
    }
    try{
        const modelName = model.split("(")[0].trim();
        var mName = ""
        if (modelName === "gpt-3.5"){
            mName = "gpt-3.5-turbo";
        } else if (modelName === "gpt-4") {
            mName = "gpt-4-0314";
        } else if (modelName === "gpt-4-turbo") {
            mName = "gpt-4-turbo-preview";
        }
        const openai = getOpenAIClient()
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: userPrompt }],
            model: mName,
          });
        return chatCompletion;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getModels(){
    if (getAPIKey() === null){
        return [];
    }
    try{
        const openai = getOpenAIClient()
        const modelList =  await openai.models.list();
        // console.log(modelList);
        var final_models = new Set();
        modelList.data.forEach(element => {
            //console.log(element.id);
            if (element.id.startsWith("gpt-3.5")){
                final_models.add("gpt-3.5 (least powerful)")
            }
            else if (element.id.startsWith("gpt-4")){
                if (!element.id.endsWith("preview")){
                    final_models.add("gpt-4 (more powerful)")
                }
                if (element.id.endsWith("preview")){
                    final_models.add("gpt-4-turbo (The latest and greatest)")
                }
            }
        });
        // console.log(final_models);
        return Array.from(final_models).sort();
    } catch (error){
        console.log(error);
        return [];
    }
    // return modelList;
}