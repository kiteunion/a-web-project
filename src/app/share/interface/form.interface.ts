export interface FormInterface {
    data: Data;
}

export interface Data {
    applicationRef: string;
    applicationData: ApplicationData;
}

export interface ApplicationData {
    source: string;
    word: Word;
    image: Image;
    contact: Contact;
    contacts: PartnershipContact[];
    address: Address;
    company: Company;
    selectedClasses: SelectedClass[];
    logo: string;
}

export interface Address {
    city: string;
    address: string;
    suburb: string;
    postCode: string;
    region: string;
    countryCode: string;
}

export interface Company {
    businessName: string;
    nameOfTrust: string;
    citizenCountryCode: string;
    businessNumber: string;
    australianCompanyNumber: string;
    phoneNumber: string;
}

export interface Contact {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    declaration?: boolean;
    ownershipType: number;
}

export interface PartnershipContact {
    email: string;
    phone: string;
    businessNumber?: string;
    businessName: string;
}

export interface Image {
    imageRef?: string | null;
}

export interface SelectedClass {
    referenceId: string;
    classNumber: number;
    name: string;
}

export interface Word {
    word: string;
}
