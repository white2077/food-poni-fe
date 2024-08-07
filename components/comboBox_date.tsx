import {useEffect, useState} from 'react';
import {Select} from "antd";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";

const ComboBoxDate = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [selectedDay, setSelectedDay] = useState<number | ''>(20);
    const [selectedMonth, setSelectedMonth] = useState<number | ''>(10);
    const [selectedYear, setSelectedYear] = useState<number | ''>(2000);

    const days = Array.from({length: 31}, (_, index) => index + 1);
    const months = Array.from({length: 12}, (_, index) => index + 1);
    const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearsList = Array.from({length: currentYear - 1900 + 1}, (_, index) => currentYear - index);
        setYears(yearsList);

        if (currentUser.birthday) {
            setSelectedDay(currentUser.birthday.getDate());
            setSelectedMonth(currentUser.birthday.getMonth() + 1);
            setSelectedYear(currentUser.birthday.getFullYear());
        }
    }, [currentUser]);

    const handleDayChange = (value: number | '') => {
        setSelectedDay(value);
    };

    const handleMonthChange = (value: number | '') => {
        setSelectedMonth(value);
    };

    const handleYearChange = (value: number | '') => {
        setSelectedYear(value);
    };

    return (
        <div className="col-span-3 w-full">
            <div className="flex justify-start items-top w-full gap-5">
                <Select className="w-28" value={selectedDay} onChange={handleDayChange}>
                    {days.map((day) => (
                        <Select.Option key={day} value={day}>
                            {day}
                        </Select.Option>
                    ))}
                </Select>
                <Select className="w-28" value={selectedMonth} onChange={handleMonthChange}>
                    {months.map((month) => (
                        <Select.Option key={month} value={month}>
                            {month}
                        </Select.Option>
                    ))}
                </Select>
                <Select className="w-28" value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                        <Select.Option key={year} value={year}>
                            {year}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default ComboBoxDate;