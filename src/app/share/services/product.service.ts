import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ClassInterface, ProductResultInterface} from '../interface/product.interface';
import {FormService} from "./form.service";

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    readonly sourceProducts: WritableSignal<ClassInterface[]> = signal([]);
    readonly sourceProductsBuffer: WritableSignal<ClassInterface[]> = signal([]);
    public targetProducts: ClassInterface[] = [];
    public targetProductsChange$: Subject<void> = new Subject<void>();
    public cardSurcharges = 0.017;

    constructor(
        public formService: FormService,
        private http: HttpClient
    ) {
        this.restore();
    }

    restore() {
        const targetProducts = localStorage.getItem('targetProductsV2');
        if (targetProducts) {
            this.targetProducts = JSON.parse(targetProducts);
            this.targetProductsChange$.next();
        }
    }

    save() {
        console.debug('Save products');
        this.targetProductsChange$.next();
        localStorage.setItem('targetProductsV2', JSON.stringify(this.targetProducts));
    }

    findKeywords(region: string, searchWord: string): Observable<ProductResultInterface> {
        const url = `${environment.backendApiUrl}/search/find-keywords`;
        return this.http.post<ProductResultInterface>(url, {
            data: {
                region,
                searchWord
            }
        });
    }

    removeDuplicateCategories(sourceProducts: ClassInterface[], targetProducts: ClassInterface[]): ClassInterface[] {
        // Создаем Set с именами категорий из targetProducts для быстрого поиска
        const targetCategories = new Set<string>();
        targetProducts.forEach(product => {
            product.categories.forEach(category => {
                targetCategories.add(category.name);
            });
        });

        // Создаем новый массив с отфильтрованными категориями
        const filteredProducts: ClassInterface[] = sourceProducts.map(product => {
            return {
                ...product,
                categories: product.categories.filter(category =>
                    !targetCategories.has(category.name)
                )
            };
        });

        // Удаляем классы, у которых не осталось категорий
        return filteredProducts.filter(product => product.categories.length > 0);
    }


    get targetProductsList(): ClassInterface[] {
        const deepCopy = this.targetProducts.map(item => ({...item}));
        deepCopy.map((v, i) => {
            v.price = this.formService.fees()?.classFee;
            v.prefix = `Trade mark ${i + 1} in `;
        })

        if (this.formService.expedited) {
            deepCopy.push({
                categories: [],
                name: "Expedite the trade mark application",
                price: this.formService.fees()?.expenditureFee || 0,
                prefix: ''
            })
        }

        if (this.formService.privacy) {
            deepCopy.push({
                categories: [],
                name: "Privacy option",
                price: this.formService.fees()?.postalFee || 0,
                prefix: ''
            })
        }
        return deepCopy;
    };

    get classesCount(): number {
        return this.targetProducts.length;
    }

    get subTotal() {
        return (this.classFee * this.classesCount);
    }

    get GST(): number {
        const classGovFee = this.formService.fees()?.classGovFee || 0;
        let total = (this.subTotal - (this.classesCount * classGovFee)) / 11;
        const expenditureFee = this.formService.fees()?.expenditureFee || 0;
        const expenditureGovFee = this.formService.fees()?.expenditureGovFee || 0;

        if (this.formService.expedited && expenditureFee > 0) {
            total += (expenditureFee - expenditureGovFee) / 11;
        }

        const postalFee = this.formService.fees()?.postalFee || 0;
        if (this.formService.privacy && postalFee > 0) {
            total += postalFee / 11;
        }
        return total;
    }

    get creditCardSurcharges(): number {
        return this.total * this.cardSurcharges;
    }

    get total(): number {
        let total = this.subTotal;
        const expenditureFee = this.formService.fees()?.expenditureFee || 0;
        if (this.formService.expedited && expenditureFee > 0) {
            total += expenditureFee;
        }
        const postalFee = this.formService.fees()?.postalFee || 0;
        if (this.formService.privacy && postalFee > 0) {
            total += postalFee;
        }

        return total;
    }

    get classFee(): number {
        return this.formService.fees()?.classFee || 0;
    }

    clear() {
        this.targetProducts = [];
        this.sourceProducts.set([]);
        this.save();
    }
}
