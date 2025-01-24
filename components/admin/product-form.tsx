'use client';

import { createProduct, updateProduct } from '@/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useZodForm } from '@/hooks/use-zod-form';
import { productDefaultValues } from '@/lib/constants';
import {
  insertProductSchema,
  InsertProductSchema,
  updateProductSchema,
} from '@/schemas/product-schema';

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui';

import { UploadButton } from '@/lib/uploadthing';
import { Product } from '@prisma/client';
import { LoaderIcon, Wand } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import slugify from 'slugify';

type ProductFormProps = {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useZodForm({
    schema: type === 'Update' ? updateProductSchema : insertProductSchema,
    mode: 'onTouched',
    defaultValues:
      product && type === 'Update'
        ? { ...product, price: product.price.toString() }
        : productDefaultValues,
  });

  const onSubmit: SubmitHandler<InsertProductSchema> = async (data) => {
    if (type === 'Create') {
      const res = await createProduct(data);

      if (res.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }

    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }
      const res = await updateProduct({ ...data, id: productId });
      if (res.error) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }

      console.log(res.message);
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form
        className='space-y-8'
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Slug'
                      {...field}
                      className='placeholder:text-xs placeholder:text-gray-500'
                    />
                    <Button
                      type='button'
                      size='sm'
                      variant='happy'
                      className='mt-2 flex h-6 items-center p-0 px-4 text-xs text-white'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        );
                      }}
                    >
                      <Wand className='svg' /> Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder='Enter stock' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='images'
            render={({}) => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='mt-2 min-h-48 space-y-2'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <Image
                          src={image}
                          key={image}
                          alt={image}
                          className='h-20 w-20 rounded-sm object-cover object-center'
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [
                              ...images,
                              ...res.map((img) => img.url),
                            ]);
                          }}
                          // onClientUploadComplete={(res: { url: string }[]) => {
                          //   form.setValue('images', [...images, res[0].url]);
                          // }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `Error! ${error.message}`,
                            });
                          }}
                          appearance={{
                            button: {
                              background: 'transparent',
                              color: '#777',
                              fontSize: '12px',
                              border: '1px solid #2a2a2a',
                              padding: '0',
                              height: '28px',
                            },
                            allowedContent: {
                              color: '#3f3f3f',
                              fontSize: '10px',
                              fontStyle: 'italic',
                            },
                          }}
                        />
                      </FormControl>
                    </div>
                    {/* <FormControl>
                      <Input placeholder='Enter images' type='file' />
                    </FormControl> */}
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>
          <span>Featured Product</span>
          <Card>
            <CardContent className='space-y-2'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='items-center space-x-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='banner'
                  className='w-full rounded-sm object-cover object-center'
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className=''>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='enter description' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className=''>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? <LoaderIcon /> : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
