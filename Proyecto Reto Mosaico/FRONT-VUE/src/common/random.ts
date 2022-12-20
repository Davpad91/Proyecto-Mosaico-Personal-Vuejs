export const generateRandomPassword = (): string => {
	const length = 10;
	let base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';
  
	if (length) base += numbers;
  
	let password = '' + '*';
	for (let x = 0; x < length; x++) {
	  const random = Math.floor(Math.random() * base.length);
	  password += base.charAt(random);
	}
  
	return password;
  };
  