import themeObj from '@/provider/theme/themeObject';
import { Variants, Weights } from '@/provider/theme/typographySettings';
import { IconProps } from 'src/assets/icons/SvgIcon';
import { breakpointsKeys } from '@/provider/theme/breakpoint';
import { NextPageContext } from 'next';
import { CSSProperties } from 'react';

type Palette = keyof typeof themeObj['palette'];
type Degree =
    | keyof typeof themeObj['palette']['primary']
    | keyof typeof themeObj['palette']['info'];

declare global {
    type AppLanguages = 'en' | 'fr' | 'es';
    type AppDir = 'ltr' | 'rtl';

    type AppPageContext = NextPageContext;

    type AppOptions = {
        value: string | number;
        option: string | number;
    };
    type ArrayOptionLoading = Array<AppOptions> | 'loading';

    type AppCommonInput = {
        name: string;
        label?: string;
        StartAdornment?: React.FC<any>;
        EndAdornment?: React.FC<any>;
    };

    type AppCommonChild = { children: React.ReactNode };
    type AppUserType =
        | {
            id: number;
            email: string;
        }
        | undefined;

    type AppBaseColorType = {
        palette?: Palette;
        degree?: Degree;
        palette2?: Palette;
        degree2?: Degree;
    };

    type AppTypographyVariant = {
        variant?: Variants;
        active?: boolean
    };
    type AppScaleVariant = {
        scale?: 'tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    };
    type AppTypographyWeight = {
        fontWeight?: Weights;
    };
    type AppTypographyProperty = {
        align?: Property.TextAlign;
    };

    type CommonIconProps = IconProps;

    type AppBreakpointKeys = keyof typeof breakpointsKeys;

    type AppStyle = CSSProperties;

    type AppQueryOption = UseQueryOptions
}
