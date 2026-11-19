import { useEffect, useState } from 'react';
import { PRODUCTS, OUTLETS, PROMOS, GALLERY_ITEMS, type Product, type Outlet, type GalleryItem } from '../data/strawberryData';
import { getPublicRows } from './supabase';
type CmsState={products:Product[];outlets:Outlet[];promos:any[];gallery:GalleryItem[]};
const fallback: CmsState={products:PRODUCTS,outlets:OUTLETS,promos:PROMOS,gallery:GALLERY_ITEMS};
export function useSiteContent(){
 const [content,setContent]=useState<CmsState>(fallback);
 useEffect(()=>{let alive=true;const load=async()=>{try{
 const [p,o,g,pr]=await Promise.all([getPublicRows<any>('site_products'),getPublicRows<any>('site_outlets'),getPublicRows<any>('site_gallery'),getPublicRows<any>('site_promos')]);
 const mappedProducts=p.filter(x=>x.is_active).map(x=>{const old=PRODUCTS.find(v=>v.id===x.id);return {id:x.id,name:x.name,category:x.category,price:x.price,originalPrice:x.original_price||undefined,unit:x.unit,description:x.description,advantages:x.advantages||[],badges:x.badges||[],rating:Number(x.rating||5),reviewsCount:x.reviews_count||0,image:x.image_url||old?.image||'',isBestSeller:x.is_best_seller} as Product;});
 const mappedOutlets=o.filter(x=>x.is_active).map(x=>{const old=OUTLETS.find(v=>v.id===x.id);return {id:x.id,name:x.name,shortName:x.short_name,tagline:x.tagline,address:x.address,landmark:x.landmark,mapsUrl:x.maps_url,openingHours:x.opening_hours,status:x.status,image:x.image_url||old?.image||'',phone:x.phone,isOpen:x.is_open} as Outlet;});
 const mappedGallery=g.filter(x=>x.is_active).map(x=>{const old=GALLERY_ITEMS.find(v=>v.id===x.id);const image=x.image_url?.startsWith('/src/assets')?old?.imageUrl:x.image_url;return {id:x.id,title:x.title,caption:x.caption,category:x.category,imageUrl:image||old?.imageUrl||''} as GalleryItem;});
 const today=new Date().toISOString().slice(0,10);const mappedPromos=pr.filter(x=>x.is_active&&(!x.starts_at||x.starts_at<=today)&&(!x.ends_at||x.ends_at>=today)).map(x=>({id:x.id,tag:x.label,title:x.title,desc:x.description,validUntil:x.ends_at?`Berlaku sampai ${x.ends_at}`:'Promo berlaku',accentColor:x.accent_color||'#F28C18',productPreset:x.product_preset||'',bannerUrl:x.banner_url||''}));
 if(alive)setContent({products:mappedProducts,outlets:mappedOutlets,gallery:mappedGallery,promos:mappedPromos});
 }catch(err){console.warn('CMS data unavailable; using original site data.',err);}};void load();const timer=window.setInterval(load,45000);const onFocus=()=>void load();window.addEventListener('focus',onFocus);return()=>{alive=false;window.clearInterval(timer);window.removeEventListener('focus',onFocus);};},[]);
 return content;
}
