class EnumConverter {
    static convertToWords(strings) {
        if (strings) {
            return strings.map(str => {
                // Remove underscores and convert to title case
                const formattedString = str.replace(/_/g, ' ').toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
                return {value: str, label: formattedString};
            });
        } else {
            return strings;
        }
    }


    static resourceNameConverter(strings) {
        if (strings) {
            return strings.filter(f => f.mainEntity.startsWith('syr')).map(str => {
                const formattedString = str.displayName.replace(/_/g, ' ').toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
                return {mainEntity: str.mainEntity, displayName: formattedString};
            });
        } else {
            return strings;
        }
    }

    static convertToLov(dataList){
        console.log("datalist",dataList)
        if (dataList) {
            return dataList.map(str => {
                return {value: str?.id, label: str?.name ? str?.name : str?.code};
            });
        } else {
            return dataList;
        }
    }

    static getInitials(accountName) {
        // Split the account name into words
        if (accountName) {
            const words = accountName.split(' ');
            let initials = '';

            // Iterate through each word
            for (let i = 0; i < words.length; i++) {
                // Get the first character of each word and capitalize it
                initials += words[i][0].toUpperCase();
            }

            return initials;
        }
    }


    static getFieldFromObjectById(list, id, fieldName) {
        console.log("list data",list, id, fieldName)
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.value === id && item[fieldName]) {
                console.log("fieldName",fieldName)
                return item[fieldName];
            }
        }
        return null; // Return null if no match found
    }


}

export {EnumConverter};
