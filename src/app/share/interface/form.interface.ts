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
    isPrivate: boolean;
    isExpedite: boolean;
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
    phone: Phone;
    declaration?: boolean;
    ownershipType: number;
}

export interface PartnershipContact {
    email: string;
    phone: Phone;
    businessNumber?: string;
    businessName: string;
}

export interface Image {
    imageRef?: string | null;
}

export interface SelectedClass {
    referenceId: string;
    classNumber: string;
    name: string;
}

export interface Word {
    word: string;
}

interface Phone {
    dialCode: string;
    countryCode: string;
    e164Number: string;
    nationalNumber: string;
    internationalNumber: string;
    number: string;
}