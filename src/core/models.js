class Task {
    constructor(taskName, modelName, description, id=null) {
        this.taskName = taskName;
        this.model = modelName || "gpt-3.5 (least powerful)"; // Default model if none selected
        this.description = description;
        this.id = id; // This will be set only for existing tasks
    }

    get realModelName() {
        const baseModelName = this.model.split("(")[0].trim();
        switch (baseModelName) {
            case "gpt-3.5":
                return "gpt-3.5-turbo";
            case "gpt-4":
                return "gpt-4-0314";
            case "gpt-4-turbo":
                return "gpt-4-turbo-preview";
            default:
                return baseModelName; // Return the base name if no special mapping exists
        }
    }
}

module.exports = {
    Task
};