async function getModels() {
    const res = await fetch('https://openrouter.ai/api/v1/models');
    const data = await res.json();
    const freeModels = data.data.filter(m => m.pricing && m.pricing.prompt === "0" && m.pricing.completion === "0");
    const freeEmbeddings = freeModels.filter(m => m.architecture && m.architecture.modality === "text->embedding" || m.id.includes("embed"));
    console.log("Free embedding models:", freeEmbeddings.map(m => m.id));

    // Check if openai/text-embedding-3-small is free (it is not)
    const openaiEmb = data.data.find(m => m.id === "openai/text-embedding-3-small");
    console.log("OpenAI Embed Pricing:", openaiEmb?.pricing);
}
getModels();
