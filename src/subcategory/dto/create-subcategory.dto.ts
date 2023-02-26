export class CreateSubcategoryDto{
    readonly name: string;
    readonly description: string;
    readonly slug: string;
    // по сути передаем в параметр имя
    categoryName: string;
}