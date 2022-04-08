type RuleViolationInfo = {

    fieldName: string,
    message: string,
    fullMessage?: string
}

export default class RuleViolationException {

    public violationInfos :  Array<RuleViolationInfo>;

    constructor(violationInfos: Array<RuleViolationInfo>) {

        // super(JSON.stringify(violationInfos))

        this.violationInfos = violationInfos

        // Object.setPrototypeOf(this, RuleViolationException.prototype)
    }
}