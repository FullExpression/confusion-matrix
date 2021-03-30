import { Injectable } from "@angular/core";

@Injectable()
export class ImportService {

    import(): Promise<string | null> {
        return new Promise<string | null>(resolve => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', '.json');
            input.style.display = 'none';
            input.addEventListener('change', (event: any) => {
                if (event?.target?.files?.length > 0) {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = (evt: any) => {
                        resolve(evt.target.result);
                    }
                    reader.onerror = () => {
                        resolve(null);
                    }
                } else {
                    resolve(null)
                }

            });
            input.click();
        });
    }
}