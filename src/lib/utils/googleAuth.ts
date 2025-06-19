// declare global {
//   interface Window {
//     google: {
//       accounts: {
//         id: {
//           initialize: (config: {
//             client_id: string;
//             callback: (response: { credential: string }) => void;
//           }) => void;
//           prompt: (res: unknown) => void;
//           renderButton: (element: Element, config: unknown) => void;
//         },
//         oauth2: {
//           initTokenClient: (config: {
//             client_id: string
//             scope: string
//             callback: (response: { access_token: string }) => void
//           }) => { requestAccessToken: () => void }
//         }
//       }
//     }
//   }
// }
export const loadGoogleScript = () => {
  return new Promise((resolve) => {
    if (!window.google) {
      resolve(null);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const initializeGoogleAuth = (callback: (res: { credential: string })=> void) => {
  console.log('Initializing Google Auth');
  window.google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    callback: callback,
  });
};