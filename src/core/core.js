import OpenAI from 'openai';

export function getAPIKey(){
    return localStorage.getItem('openAIKey');
}

const openai = new OpenAI({
    apiKey: getAPIKey(),
    dangerouslyAllowBrowser: true
});


export async function getModels(){
    if (getAPIKey() === null){
        return [];
    }
    try{
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