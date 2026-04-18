export class StringNormalizer{
    public static trim(value?:string):string{
        return (value ?? "").trim();
    }
    public static normalizeSpaces(value?:string):string{
        return (value ?? "").trim().replace(/\s+/g, " ");
    }
    public static normalizeEmail(value?:string):string{
        return (value ?? "").trim().toLocaleLowerCase();
    }
}