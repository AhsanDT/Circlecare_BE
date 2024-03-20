export const customStyles = {
    header: {
        style: { minHeight: '56px' },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: '#E1E2E9',
        },
    },
    headCells: {
        style: {
            '&:not(:last-of-type)': {
                color: '#2C2D33',
                fontsize: '14px',
        //         borderRightStyle: 'solid',
        //         borderRightWidth: '1px',
        //         borderRightColor: '#ddd',
            },
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                color: '#6E7079',
                fontsize: '14px',
        //         borderRightStyle: 'solid',
        //         borderRightWidth: '1px',
        //         borderRightColor: '#ddd',
            },
        },
    },
}