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

type Props = { product?: Product };

export const getResourceLinks = (product?: Product, t?: (key: string) => string) => {
    return buildResources(product, t);
};
export const buildResources = (product?: Product, t?: (key: string) => string) => {
    if (!product) return [] as { href: string; label: string }[];
    const model = product.modelName ?? '';
    return resourcesLinks
        .map((r) => {
            const fieldName = r.field as keyof Product;
            const href = product[fieldName];
            if (typeof href !== 'string' || href.trim() === '') return null;
            const label = t ? `${model} ${t(r.title)}` : `${model} ${r.title}`;
            return { href, label };
        })
        .filter((x): x is { href: string; label: string } => x !== null);
};
const ResourcesSection: React.FC<Props> = ({ product }) => {
    const t = useTranslations();
    const links = buildResources(product, t);
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
        <ResourcesSection product={productData}/>
    );
}

now I'm getting error at product wrapper file where const resourceLinks = getResourceLinks(product, (k) => t(k)); as not found. and another error here :
{hasResources ? {CUSTOM_STACK_LABELS.resources} : {CUSTOM_STACK_LABELS.support}}
                  </div>
                  {hasResources ? 
                    {resourcesSectionSlot}
error: Type '{ resourcesSectionSlot: Boolean; } | { supportSectionSlot: ReactNode; }' is not assignable to type 'ReactNode'.
  Object literal may only specify known properties, and 'resourcesSectionSlot' does not exist in type 'ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<...>'.
Object literal may only specify known properties, and 'CUSTOM_STACK_LABELS' does not exist in type 'ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<...>'.
',' expected.

please fix it
