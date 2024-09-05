export const formatDateTime = (dateTimeString :string) => {

    const dateTime = new Date(dateTimeString);
    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12 || 12; 
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    const now = new Date();
    const timeDiff = now.getTime() - dateTime.getTime();
    const isOlderThan24Hours = timeDiff > 24 * 60 * 60 * 1000;
    const isOlderThan48Hours = timeDiff > 48 * 60 * 60 * 1000;

    if (now.getDate() !== dateTime.getDate()) {
      if (now.getDate() - dateTime.getDate() === 1) {
        return `yesterday`;
      } 
      const day = dateTime.getDate();
      const month = dateTime.getMonth() + 1;
      const dateString = `${day}/${month}`;
        return `${dateString}`;
    }
      return timeString;
  };

  export function generateAvator(name :string){

    const AVATAR_GENERATION_URL = 'https://ui-avatars.com/api/?name=';
    return `${AVATAR_GENERATION_URL}${name || ''}`;

  }

  export function getName(to:string ,from: string){
   return from === 'Dev tools'? to : from
  }

  export function getPsId(to:any ,from: any){
    return from?.name === 'Dev tools'? to?.id : from?.id
   }
 
  