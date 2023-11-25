let selectedProblem;
let fileProblems = [];
let codeFile = '';

const ICONS = {
  Bug: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-1.625 0-3.013-.8T6.8 18H5q-.425 0-.712-.288T4 17q0-.425.288-.713T5 16h1.1q-.075-.5-.088-1T6 14H5q-.425 0-.713-.288T4 13q0-.425.288-.713T5 12h1q0-.5.013-1t.087-1H5q-.425 0-.713-.288T4 9q0-.425.288-.713T5 8h1.8q.35-.575.788-1.075T8.6 6.05l-.925-.95Q7.4 4.825 7.4 4.412t.3-.712q.275-.275.7-.275t.7.275l1.45 1.45q.7-.225 1.425-.225t1.425.225l1.5-1.475q.275-.275.687-.275t.713.3q.275.275.275.7t-.275.7l-.95.95q.575.375 1.037.863T17.2 8H19q.425 0 .713.288T20 9q0 .425-.288.713T19 10h-1.1q.075.5.088 1T18 12h1q.425 0 .712.288T20 13q0 .425-.288.713T19 14h-1q0 .5-.013 1t-.087 1H19q.425 0 .713.288T20 17q0 .425-.288.713T19 18h-1.8q-.8 1.4-2.188 2.2T12 21Zm-1-5h2q.425 0 .713-.288T14 15q0-.425-.288-.713T13 14h-2q-.425 0-.713.288T10 15q0 .425.288.713T11 16Zm0-4h2q.425 0 .713-.288T14 11q0-.425-.288-.713T13 10h-2q-.425 0-.713.288T10 11q0 .425.288.713T11 12Z"/></svg>',
  Vulnerability:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17 7.55q-.125 0-.25-.025t-.25-.1l-.875-.5q-.35-.2-.763-.087t-.612.462l-.125.2l1 .575q.525.3.688.9t-.138 1.125L15 11.3q.575.9.863 1.913t.287 2.087q0 3.125-2.187 5.313T8.65 22.8q-3.125 0-5.313-2.212T1.15 15.25q0-3.125 2.163-5.288T8.6 7.8h.325L9.6 6.625q.3-.55.9-.712t1.15.162l.75.425l.125-.2q.575-1.075 1.8-1.4t2.3.3l.85.475q.225.125.375.362t.15.513q0 .425-.288.712T17 7.55Zm3 .25q0-.425.288-.712T21 6.8h1q.425 0 .713.288T23 7.8q0 .425-.288.713T22 8.8h-1q-.425 0-.713-.288T20 7.8Zm-4.5-4.5q-.425 0-.713-.287T14.5 2.3v-1q0-.425.288-.713T15.5.3q.425 0 .713.288t.287.712v1q0 .425-.288.713T15.5 3.3Zm3.175 1.325q-.275-.275-.275-.7t.275-.7L19.4 2.5q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-.725.725q-.275.275-.7.275t-.7-.275Z"/></svg>',
  Security:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19.9q2.425-.75 4.05-2.962T17.95 12H12V4.125l-6 2.25v5.175q0 .175.05.45H12v7.9Zm0 2q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9Z"/></svg>',
  debt: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22ZM6.325 6.325L12 12V4q-1.6 0-3.075.6t-2.6 1.725Z"/></svg>',
  'Code Smell':
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M8.15 21.75L6.7 19.3l-2.75-.6q-.375-.075-.6-.388t-.175-.687L3.45 14.8l-1.875-2.15q-.25-.275-.25-.65t.25-.65L3.45 9.2l-.275-2.825q-.05-.375.175-.688t.6-.387l2.75-.6l1.45-2.45q.2-.325.55-.438t.7.038l2.6 1.1l2.6-1.1q.35-.15.7-.038t.55.438L17.3 4.7l2.75.6q.375.075.6.388t.175.687L20.55 9.2l1.875 2.15q.25.275.25.65t-.25.65L20.55 14.8l.275 2.825q.05.375-.175.688t-.6.387l-2.75.6l-1.45 2.45q-.2.325-.55.438t-.7-.038l-2.6-1.1l-2.6 1.1q-.35.15-.7.038t-.55-.438ZM12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Z"/></svg>',
  Blocker:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q1.35 0 2.6-.438t2.3-1.262L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20Zm6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7l11.2 11.2Z"/></svg>',
  Critical:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M2.725 21q-.275 0-.5-.138t-.35-.362q-.125-.225-.138-.488t.138-.512l9.25-16q.15-.25.388-.375T12 3q.25 0 .488.125t.387.375l9.25 16q.15.25.138.513t-.138.487q-.125.225-.35.363t-.5.137H2.725ZM12 18q.425 0 .713-.288T13 17q0-.425-.288-.713T12 16q-.425 0-.713.288T11 17q0 .425.288.713T12 18Zm0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.713T12 10q-.425 0-.713.288T11 11v3q0 .425.288.713T12 15Z"/></svg>',
  Major:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 13.825L8.1 17.7q-.275.275-.688.288T6.7 17.7q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.213t.375-.062q.2 0 .375.062t.325.213l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 13.825Zm0-6L8.1 11.7q-.275.275-.688.288T6.7 11.7q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.212T12 5.425q.2 0 .375.063t.325.212l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 7.825Z"/></svg>',
  Minor:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16.175l3.9-3.875q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062q-.2 0-.375-.063T11.3 18.3l-4.6-4.6q-.275-.275-.288-.687T6.7 12.3q.275-.275.7-.275t.7.275l3.9 3.875Zm0-6L15.9 6.3q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062q-.2 0-.375-.062T11.3 12.3L6.7 7.7q-.275-.275-.288-.688T6.7 6.3q.275-.275.7-.275t.7.275l3.9 3.875Z"/></svg>',
  Info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.713T12 11q-.425 0-.713.288T11 12v4q0 .425.288.713T12 17Zm0-8q.425 0 .713-.288T13 8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8q0 .425.288.713T12 9Zm0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>',
  duplicate:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm-4 4q-.825 0-1.413-.588T3 20V7q0-.425.288-.713T4 6q.425 0 .713.288T5 7v13h10q.425 0 .713.288T16 21q0 .425-.288.713T15 22H5Z"/></svg>',
  design:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m8.8 10.95l2.15-2.175l-1.4-1.425l-.4.4q-.275.275-.688.288T7.75 7.75q-.3-.3-.3-.713t.3-.712l.375-.375L7 4.825L4.825 7L8.8 10.95Zm8.2 8.225L19.175 17l-1.125-1.125l-.4.375q-.3.3-.7.3t-.7-.3q-.3-.3-.3-.7t.3-.7l.375-.4l-1.425-1.4l-2.15 2.15L17 19.175ZM17.6 5l1.425 1.425L17.6 5ZM4 21q-.425 0-.713-.288T3 20v-2.825q0-.2.075-.388t.225-.337l4.075-4.075L3.05 8.05Q2.625 7.625 2.625 7t.425-1.05l2.9-2.9q.425-.425 1.05-.412t1.05.437L12.4 7.4l3.775-3.8q.3-.3.675-.45t.775-.15q.4 0 .775.15t.675.45L20.4 4.95q.3.3.45.675T21 6.4q0 .4-.15.763t-.45.662l-3.775 3.8l4.325 4.325q.425.425.425 1.05t-.425 1.05l-2.9 2.9q-.425.425-1.05.425t-1.05-.425l-4.325-4.325L7.55 20.7q-.15.15-.337.225T6.825 21H4Zm1-2h1.4l9.8-9.775L14.775 7.8L5 17.6V19ZM15.5 8.525l-.725-.725L16.2 9.225l-.7-.7Z"/></svg>',
  'best-practices':
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7.5 22q-1.45 0-2.475-1.025T4 18.5v-13q0-1.45 1.025-2.475T7.5 2H18q.825 0 1.413.587T20 4v12.525q0 .2-.163.363t-.587.362q-.35.175-.55.5t-.2.75q0 .425.2.763t.55.487q.35.15.55.413t.2.562v.25q0 .425-.288.725T19 22H7.5ZM9 15q.425 0 .713-.288T10 14V5q0-.425-.288-.713T9 4q-.425 0-.713.288T8 5v9q0 .425.288.713T9 15Zm-1.5 5h9.325q-.15-.35-.237-.713T16.5 18.5q0-.4.075-.775t.25-.725H7.5q-.65 0-1.075.438T6 18.5q0 .65.425 1.075T7.5 20Z"/></svg>',
  performance:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10.45 15.5q.625.625 1.575.588T13.4 15.4l4.225-6.325q.225-.35-.062-.638t-.638-.062L10.6 12.6q-.65.45-.712 1.363t.562 1.537ZM5.1 20q-.55 0-1.012-.238t-.738-.712q-.65-1.175-1-2.438T2 14q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 4q2.05 0 3.85.775T19 6.888q1.35 1.337 2.15 3.125t.825 3.837q.025 1.375-.313 2.688t-1.037 2.512q-.275.475-.738.713T18.875 20H5.1Z"/></svg>',
  'code-style':
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m8.825 12l1.475-1.475q.3-.3.3-.7t-.3-.7q-.3-.3-.713-.3t-.712.3L6.7 11.3q-.15.15-.213.325T6.425 12q0 .2.062.375t.213.325l2.175 2.175q.3.3.713.3t.712-.3q.3-.3.3-.7t-.3-.7L8.825 12Zm6.35 0L13.7 13.475q-.3.3-.3.7t.3.7q.3.3.713.3t.712-.3L17.3 12.7q.15-.15.213-.325t.062-.375q0-.2-.063-.375T17.3 11.3l-2.175-2.175q-.15-.15-.338-.225t-.375-.075q-.187 0-.375.075t-.337.225q-.3.3-.3.7t.3.7L15.175 12ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"/></svg>',
  documentation:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V4q0-.825.588-1.413T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V11q-.575.125-1.075.4t-.925.7l-5.4 5.4q-.275.275-.437.638T12 18.9V22H6Zm8-1v-1.65q0-.2.075-.388t.225-.337l5.225-5.2q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55q0 .275-.1.563t-.325.512l-5.2 5.2q-.15.15-.338.225T16.65 22H15q-.425 0-.712-.287T14 21Zm6.575-4.6l.925-.975l-.925-.925l-.95.95l.95.95ZM14 9h4l-5-5l5 5l-5-5v4q0 .425.288.713T14 9Z"/></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>',
  problem:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 16q.425 0 .713-.288T8 15q0-.425-.288-.713T7 14q-.425 0-.713.288T6 15q0 .425.288.713T7 16Zm0-3q.425 0 .713-.288T8 12V9q0-.425-.288-.713T7 8q-.425 0-.713.288T6 9v3q0 .425.288.713T7 13Zm4 2h6q.425 0 .713-.288T18 14q0-.425-.288-.713T17 13h-6q-.425 0-.713.288T10 14q0 .425.288.713T11 15Zm0-4h6q.425 0 .713-.288T18 10q0-.425-.288-.713T17 9h-6q-.425 0-.713.288T10 10q0 .425.288.713T11 11Zm-7 9q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Z"/></svg>',
  suggestion:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7q.425 0 .713-.288T13 6q0-.425-.288-.713T12 5q-.425 0-.713.288T11 6q0 .425.288.713T12 7Zm0 8q.425 0 .713-.288T13 14v-4q0-.425-.288-.713T12 9q-.425 0-.713.288T11 10v4q0 .425.288.713T12 15Zm-6 3l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.588 1.413T20 18H6Z"/></svg>',
  'insecure-dependencies':
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm4.45-8.725L12 11l2.55 1.275q.5.25.975-.038t.475-.862V5H8v6.375q0 .575.475.863t.975.037ZM8 17h3q.425 0 .713-.288T12 16q0-.425-.288-.713T11 15H8q-.425 0-.713.288T7 16q0 .425.288.713T8 17Z"/></svg>',
  Uncatalogued:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7.425 9.475L11.15 3.4q.15-.25.375-.363T12 2.925q.25 0 .475.113t.375.362l3.725 6.075q.15.25.15.525t-.125.5q-.125.225-.35.363t-.525.137h-7.45q-.3 0-.525-.138T7.4 10.5q-.125-.225-.125-.5t.15-.525ZM17.5 22q-1.875 0-3.188-1.313T13 17.5q0-1.875 1.313-3.188T17.5 13q1.875 0 3.188 1.313T22 17.5q0 1.875-1.313 3.188T17.5 22ZM3 20.5v-6q0-.425.288-.713T4 13.5h6q.425 0 .713.288T11 14.5v6q0 .425-.288.713T10 21.5H4q-.425 0-.713-.288T3 20.5Z"/></svg>',
  time: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-1.85 0-3.488-.713T5.65 18.35q-1.225-1.225-1.938-2.863T3 12q0-1.95.75-3.65t2.1-2.925q.325-.275.725-.263t.675.288l5.45 5.45q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L6.6 7.6q-.75.9-1.175 2.013T5 12q0 2.9 2.05 4.95T12 19q2.9 0 4.95-2.05T19 12q0-2.675-1.713-4.612T13 5.1V6q0 .425-.288.713T12 7q-.425 0-.713-.288T11 6V4q0-.425.288-.713T12 3q1.85 0 3.488.713T18.35 5.65q1.225 1.225 1.938 2.863T21 12q0 1.85-.713 3.488T18.35 18.35q-1.225 1.225-2.863 1.938T12 21Zm-5-8q-.425 0-.713-.288T6 12q0-.425.288-.713T7 11q.425 0 .713.288T8 12q0 .425-.288.713T7 13Zm5 5q-.425 0-.713-.288T11 17q0-.425.288-.713T12 16q.425 0 .713.288T13 17q0 .425-.288.713T12 18Zm5-5q-.425 0-.713-.288T16 12q0-.425.288-.713T17 11q.425 0 .713.288T18 12q0 .425-.288.713T17 13Z"/></svg>',
  back: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.425 12q0-.2.063-.375T4.7 11.3l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12q0 .425-.288.713T19 13H7.825Z"/></svg>',
  file: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 12h6q.425 0 .713-.288T16 11q0-.425-.288-.713T15 10H9q-.425 0-.713.288T8 11q0 .425.288.713T9 12Zm0-4h6q.425 0 .713-.288T16 7q0-.425-.288-.713T15 6H9q-.425 0-.713.288T8 7q0 .425.288.713T9 8Zm10.95 12.475L15.9 15.2q-.425-.575-1.05-.887T13.5 14H4V4q0-.825.588-1.413T6 2h12q.825 0 1.413.588T20 4v16q0 .125-.013.238t-.037.237ZM6 22q-.825 0-1.412-.588T4 20v-4h9.5q.25 0 .463.113t.362.312l4.2 5.5q-.125.05-.262.063T18 22H6Z"/></svg>',
};

const SEVERITY = {
  1: 'Blocker',
  2: 'Critical',
  3: 'Major',
  4: 'Minor',
  5: 'Info',
};

async function loadFile(fileName) {
  const fetchData = await fetch('../data/' + fileName);
  return await fetchData.json();
}

async function loadFiles() {
  resultsData = await loadFile('scan_result.json');
  qualityGateResultData = await loadFile('quality_gate_result.json');
}

async function loadCodeFile(path) {
  path = '../code/force-app' + path.split('force-app')[1];
  const fetchData = await fetch(path);
  return await fetchData.text();
}

async function init() {
  this.show('#spinner');
  this.hide('#main');
  await loadFiles();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  selectedProblem = resultsData.allProblems.find((problem) => problem.id === id);
  fileProblems = resultsData.allProblems.filter((problem) => problem.path === selectedProblem.path);
  codeFile = await loadCodeFile(selectedProblem.path);
  this.setHtml('#leftContent', createProblemList());
  this.setHtml('#rightContent', renderCodeFile());
  this.hide('#spinner');
  this.show('#main');
  location.hash = '#' + id;
}

function createProblemList() {
  const root = resultsData.branch ? resultsData.branch : 'project-root';
  const path = root + '/force-app' + selectedProblem.path.split('force-app')[1].replaceAll('\\', '/');
  return `
  <div class="row">
    <div class="col text-truncate">
      <h4 class="fw-semibold" style="font-size:13px">${path}</h4>
    </div>
  </div>
  <div class="row justify-content-evenly">
    <div class="col">
      <a href="./issues.html" class="filter-link">${ICONS['back']}</a>
    </div>
    <div class="col-auto pe-5 pt-1">
      <h4 class="fw-semibold" style="font-size:18px">${fileProblems.length} Issues</h4>
    </div>
  </div>
  <hr/>
  <ul style="list-style: none; padding: 0; margin-right: 10px; padding-right: 10px;">
    ${fileProblems.map((problem) => renderProblem(problem)).join('')}
  </ul>
  `;
}

function renderCodeFile() {
  const root = resultsData.branch ? resultsData.branch : 'project-root';
  const path = root + '/force-app' + selectedProblem.path.split('force-app')[1].replaceAll('\\', '/');
  codeFile = codeFile.replaceAll('<', '&lt;').replaceAll('>', '&gt;').trim();
  const fileLines = codeFile.split('\n');
  return `
  <div>
    <div class="card h-100" style="overflow-y: none; overflow-x: auto; margin: 0px">
      <div class="card-header p-3 fw-semibold" style="font-size: 13px;">
        <span>${ICONS['file']}</span> ${path}
      </div>
      <div class="card-body" style="padding: 0px; margin: 0px">
<table>
<tbody>
${renderLines(fileLines)}
</tbody>
</table>
      </div>
    </div>
  </div>
  `;
}

function renderLines(fileLines) {
  let content = '';
  const total = fileLines.length;
  for (let i = 0; i < total; i++) {
    const line = fileLines[i];
    const lineNumber = i + 1;
    const problems = fileProblems.filter((problem) => problem.line === i);
    if (problems.length > 0) {
      for (const problem of problems) {
        content += renderFileProblem(problem);
      }
    }
    content += `<tr>
    <td class="text-truncate line-number"><pre>${lineNumber}</pre></td>
    <td style="padding-right: 10px; padding-left: 10px;"><pre>${line}</pre></td>
    </tr>`;
  }
  return content;
}

function renderProblem(problem) {
  const type = problem.ruleType ?? 'Uncatalogued';
  return `
    <li class="problem">
      <a href="#${problem.id}" style="text-decoration:none; color: black;">
        <div class="row justify-content-evenly">
          <div class="col">
            <h6 class="fw-semibold">${problem.message}</h6>
          </div>
        </div>
        <div class="row px-3 justify-content-between">
          <div class="col-auto">
            <span>${ICONS['time']}</span> <span style="font-size: 12px">${problem.duration} effort</span>
          </div>
          <div class="col-auto">
            <div class="row justify-content-end">
              <div class="col-auto"><span>${ICONS[type]}</span> <span style="font-size: 12px">${type}</span></div>
              <div class="col-auto"><span>${ICONS[SEVERITY[problem.severity]]}</span> <span style="font-size: 12px">${
    SEVERITY[problem.severity]
  }</span></div>
            </div>
          </div>
        </div>
      </a>
    </li>
  `;
}

function renderFileProblem(problem) {
  const type = problem.ruleType ?? 'Uncatalogued';
  return `<tr>
  <td class="text-truncate line-number"></td>
  <td>
  <div class="problem" style="max-width: 1000px; margin-bottom: 3px">
  <a style="text-decoration:none; color: black;" id="${problem.id}">
    <div class="row justify-content-evenly">
      <div class="col">
        <h6 class="fw-semibold">${problem.message}</h6>
      </div>
    </div>
    <div class="row px-3 justify-content-between">
      <div class="col-auto">
        <span>${ICONS['time']}</span> <span style="font-size: 12px">${problem.duration} effort</span>
      </div>
      <div class="col-auto">
        <div class="row justify-content-end">
          <div class="col-auto"><span>${ICONS[type]}</span> <span style="font-size: 12px">${type}</span></div>
          <div class="col-auto"><span>${ICONS[SEVERITY[problem.severity]]}</span> <span style="font-size: 12px">${
    SEVERITY[problem.severity]
  }</span></div>
        </div>
      </div>
    </div>
  </a>
  </div>
  </td>
  <tr>
  `;
}

function show(element) {
  if (document.querySelector(element)?.classList?.contains('d-none')) {
    document.querySelector(element)?.classList?.remove('d-none');
  }
}

function hide(element) {
  if (!document.querySelector(element)?.classList?.contains('d-none')) {
    document.querySelector(element)?.classList?.add('d-none');
  }
}

function enable(element) {
  if (document.querySelector(element)?.classList?.contains('disabled')) {
    document.querySelector(element)?.classList?.remove('disabled');
  }
}

function disable(element) {
  if (!document.querySelector(element)?.classList?.contains('disabled')) {
    document.querySelector(element)?.classList?.add('disabled');
  }
}

function setHtml(element, html) {
  const el = document.querySelector(element);
  if (el) {
    el.innerHTML = html;
  }
}
