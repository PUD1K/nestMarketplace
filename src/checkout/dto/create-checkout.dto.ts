export class CreateCheckoutDto{
    readonly address: string;
    readonly userId: number;
    readonly username: string;
    readonly basketProductsId: [number];
}