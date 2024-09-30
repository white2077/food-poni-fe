import {ReactNode, Suspense} from "react";
import {getCSSVariableValue} from "@/_metronic/assets/ts/_utils";
import TopBarProgress from "react-topbar-progress-indicator";

export default function SuspensedView({children}: {children: ReactNode}) {
    const baseColor = getCSSVariableValue('--tw-color-primary')
    TopBarProgress.config({
        barColors: {
            '0': baseColor,
        },
        barThickness: 1,
        shadowBlur: 5,
    })
    return <Suspense fallback={<TopBarProgress/>}>{children}</Suspense>
}