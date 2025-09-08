static.ts:
export const resourcesLinks = [
  {
    field: 'driverDownload',
    title: 'resourcesSection.Driver'
  },
  {
    field: 'userManual',
    title: 'resourcesSection.UserManual'
  },
  {
    field: 'gettingStartedGuide',
    title: 'resourcesSection.GettingStarted'
  },
  {
    field: 'calibrationProcedure',
    title: 'resourcesSection.Calibration'
  },
  {
    field: 'dimensionalDrawing',
    title: 'resourcesSection.DimensionalDrawings'
  },
  {
    field: 'productCertification',
    title: 'resourcesSection.ProductCertifications'
  },
  {
    field: 'letterOfVolatility',
    title: 'resourcesSection.LetterOfVolatility'
  },
  {
    field: 'accessoryGuide',
    title: 'resourcesSection.AccessoryGuide'
  }
];
en.json:
 "resourcesSection": {
    "Driver": "Driver Download",
    "UserManual": "User Manual(s)",
    "GettingStarted": "Getting Started Guide(s)",
    "Calibration": "Calibration Procedure(s)",
    "DimensionalDrawings": "Dimensional Drawing(s)",
    "ProductCertifications": "Product Certification(s)",
    "LetterOfVolatility": "Letter of Volatility",
    "AccessoryGuide": "Accessory Guide"
  }
Client components:
product wrapper.tsx: 
"use client";
import React, { ReactNode } from "react";
import { CUSTOM_STACK_LABELS } from "@/root/constants/componentTileLabels";
import { Column, Grid, Stack, Tile } from "@carbon/react";
import { getResourceLinks } from '../resources-section';

interface ProductWrapperProps {
  productHeaderSlot?: ReactNode;
  ImageGallerySlot: ReactNode;
  OverviewSlot?: ReactNode;
  PartNumberTableSlot?: ReactNode;
  children?: ReactNode;
  supportSectionSlot?: ReactNode;
  resourcesSectionSlot?: Boolean;
}
const resourceLinks = getResourceLinks(product, (k) => t(k));
const hasResources = resourceLinks.length > 0;
const ProductWrapper = ({
  productHeaderSlot,
  ImageGallerySlot,
  OverviewSlot,
  PartNumberTableSlot,
  children,
  supportSectionSlot,
  resourcesSectionSlot,
}: ProductWrapperProps) => {

  return (
    <Stack as="div">
      <div className="hw-pdp-breadcrumb">{CUSTOM_STACK_LABELS.breadcrumb}</div>
      <Stack className="hw-pdp-content" gap={5}>
        {children}
        <Stack gap={7}>
          {productHeaderSlot}
          <Grid fullWidth>
            <Column sm={2} md={4} lg={8}>
              {ImageGallerySlot}
            </Column>
            <Column sm={2} md={4} lg={8}>
              {OverviewSlot}
            </Column>
          </Grid>
          {PartNumberTableSlot}
          <Tile>{CUSTOM_STACK_LABELS.keyAttribute}</Tile>
          <Tile>{CUSTOM_STACK_LABELS.checkoutFunctionality}</Tile>
          <Tile>{CUSTOM_STACK_LABELS.accessoriesTable}</Tile>
          <Grid fullWidth>
            <Column span={100}>
              <Grid>
                <Column lg={7} md={3} sm={4}>
                  <div className='section-heading'>
                    {hasResources ? {CUSTOM_STACK_LABELS.resources} : {CUSTOM_STACK_LABELS.support}}
                  </div>
                  {hasResources ? 
                    {resourcesSectionSlot}
                   : 
                    {supportSectionSlot}
                  }
                </Column>
                <Column lg={3} md={2} sm={4}>
                  <div className='section-heading'>
                    {CUSTOM_STACK_LABELS.firstSteps}
                  </div>
                </Column>
                {hasResources && (
                  <Column lg={6} md={3} sm={4}>
                  <div className='section-heading'>
                    {CUSTOM_STACK_LABELS.support}
                  </div>
                  {supportSectionSlot}
                </Column>
                )}
              </Grid>
            </Column>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductWrapper;

resources section: 
'use client';
import React from 'react';
import { Grid, Column, Tile, Link, Stack } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { useTranslations } from 'next-intl';
import { resourcesLinks } from '../../../constants/static';
import { Product } from '../../../constants/types';
import './index.scss';

type Props = { productData?: Product };

export const getResourceLinks = (productData?: Product, t?: (key: string) => string) => {
    return buildResources(productData, t);
};
export const buildResources = (productData?: Product, t?: (key: string) => string) => {
    console.log("!!productData", productData);
    if (!productData) return [] as { href: string; label: string }[];
    const model = productData?.modelName ?? '';
    return resourcesLinks
        .map((r) => {
            const fieldName = r.field as keyof Product;
            const href = productData[fieldName];
            if (typeof href !== 'string' || href.trim() === '') return null;
            const label = t ? `${model} ${t(r.title)}` : `${model} ${r.title}`;
            return { href, label };
        })
        .filter((x): x is { href: string; label: string } => x !== null);
};
const ResourcesSection: React.FC<Props> = ({ productData }) => {
    const t = useTranslations();
    const links = buildResources(productData, t);
    if (links.length === 0) return null;
    return (
        <Tile className='resources-section'>
            <Grid fullWidth>
                {links.map((link, idx) => (
                    <Column key={link.label + idx} lg={3} md={2} sm={4}>
                        <Stack gap={3}>
                            <Link href={link.href} target="_blank" renderIcon={ArrowRight} aria-label={link.label}>
                                {link.label}
                            </Link>
                        </Stack>
                    </Column>
                ))}
            </Grid>
        </Tile>
    );
};
export default ResourcesSection;


server component :
resources-section wrapper: 
import React from "react";
import ResourcesSection from "../../clientComponents/resources-section";

export default async function ResourcesSectionWrapper({ productData }) {
    return (
        <ResourcesSection productData={productData}/>
    );
}
page.tsx:
import React from "react";
import type { Metadata } from "next";
import "./page.scss";
import { getHwPdpDetails } from "@/root/utils/apiUtils/hwPdpApi";
import { cookies } from "next/headers";
import { getCookieValue } from "@/root/utils/commonHelpers";
import { Product } from "@/root/constants/types";
import { logger } from "@/root/utils/logger";
import { PartNumberProvider } from "../../../PartNumberContext";
import ProductWrapper from "@/root/components/clientComponents/product-wrapper";
import ImageGalleryWrapper from "@/root/components/serverComponents/image-gallery-wrapper";
import OverviewWrapper from "@/root/components/serverComponents/overview-wrapper";
import PartNumberTableWrapper from "@/root/components/serverComponents/partnumber-table-wrapper";
import HeaderWrapper from "@/root/components/serverComponents/header-wrapper";
import SupportSectionWrapper from "@/root/components/serverComponents/support-section-wrapper";
import ResourcesSectionWrapper from "@/root/components/serverComponents/resources-section-wrapper";

interface ModelPageProps {
  params: Promise<{
    modelName: string;
  }>;
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { modelName } = await params;
  return {
    title: `${modelName} - NI`,
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { modelName } = await params;
  const cookieStore = await cookies();
  const locale = getCookieValue(cookieStore.toString(), "locale") || "";
  let pdpData: Product | null = null;
  try {
    const hwPdpResponse: Product = await getHwPdpDetails(
      { locale, entityType: "ProductItem", parentModelId: parseInt(modelName) }
    );

    if (hwPdpResponse?.modelName) {
      logger.log("info", "HW PDP Response received:::", { response: hwPdpResponse });
      pdpData = hwPdpResponse;
    }
  } catch (error) {
    logger.error("Error fetching cart data in page.tsx:", error?.response || error);
  }

  return (
    <PartNumberProvider>
      <ProductWrapper
        productHeaderSlot={<HeaderWrapper productData={pdpData} />}
        ImageGallerySlot = {<ImageGalleryWrapper />}
        OverviewSlot={<OverviewWrapper />}
        PartNumberTableSlot = {<PartNumberTableWrapper />}
        supportSectionSlot = {<SupportSectionWrapper />}
        resourcesSectionSlot = {<ResourcesSectionWrapper productData={pdpData}/>}
      />
    </PartNumberProvider>
  );

}
productHeader.tsx:
"use client";
import React from 'react';
import { Checkmark } from '@carbon/icons-react';
import './ProductHeader.scss';
import { Heading, Section, Stack } from '@carbon/react';
import { Product } from '@/root/constants/types';
import { useTranslations } from 'next-intl';
import { usePartNumber } from "@/root/app/[locale]/PartNumberContext"; 

interface ProductHeaderProps {
    productData: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ productData }) => {
    const t = useTranslations("Product");
    const { selectedPartNumber, setSelectedPartNumber } = usePartNumber();

    return (
        <Stack gap={5} orientation="vertical" className='productHeader'>
            <Section level={3} className='modelName'>
                <Heading>{productData?.modelName}</Heading>
            </Section>
            <Stack gap={5} orientation="horizontal" className="partNumberVisibility">
                <div className="partNumberLabel">
                    <span>{t("partNumbers")}:</span>
                </div>
                <Stack orientation="horizontal" gap={5} className="partNumberList">
                    {(productData?.details ?? []).map((product) => {
                        const isSelected = product?.["partNumber"] === selectedPartNumber?.["partNumber"];
                        return (
                            <Stack
                                orientation="horizontal"
                                gap={3}
                                key={product["partNumber"]}
                                className={`partNumber${isSelected ? ' selected' : ''}`}
                                onClick={() => setSelectedPartNumber(product)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={isSelected}
                            >
                                {product["partNumber"]}
                                {isSelected && (
                                    <span className="checkmark" data-testid={`checkmark-${product["partNumber"]}`}>
                                        <Checkmark size={14} />
                                    </span>
                                )}
                            </Stack>
                        );
                    })}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ProductHeader;

header-wrapper:
import React from "react"
import ProductHeader from "../../clientComponents/product-header";

export default async function HeaderWrapper({ productData }) {
    return (
        <ProductHeader productData={productData} />
    );
}

I'm getting undefined at productData for resources. Please let me know what wrong I'm doing jisse I'm not getting data from API. For productHeader we're getting the data as is. 
