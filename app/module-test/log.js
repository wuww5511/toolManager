const type = +process.argv[process.argv.length - 1];

switch(type) {
    
    case 0:
        console.log('log');
        break;
    case 1:
        setTimeout(() => console.log('2end'), 2000);
        break;
    default:
        console.log('default');
}