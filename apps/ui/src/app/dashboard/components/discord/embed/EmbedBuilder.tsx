import { APIEmbed, APIEmbedField } from 'discord-api-types/v10'
import { GanttChart, Image, Plus, Trash } from 'lucide-react'
import React from 'react'
import {
  Controller,
  useForm,
  UseFormGetValues,
  UseFormReturn,
  UseFormSetValue,
} from 'react-hook-form'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Button } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { css, cx } from '../../../../../../styled-system/css'

const embedStyle = css({
  bg: '#2b2929',
  p: '15px',
  rounded: '10px',
  width: '550px',
  pos: 'relative',
  overflow: 'hidden',
})

const imgPlaceHolderStyle = css({
  border: '1px dashed grey',
  rounded: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '.3s',
  cursor: 'pointer',
  '& svg': {
    transition: '.3s',
  },
  _hover: {
    border: 'specialDashed',

    '& svg': {
      stroke: 'special !important',
    },
  },
})

const ImagePlaceHolder = ({ size }: { size: number }) => {
  return (
    <div style={{ padding: `${2 * size}px` }} className={imgPlaceHolderStyle}>
      <Image strokeWidth={1} color="grey" size={2 * (size / 0.6)} />
    </div>
  )
}

const ImagePlacerHolderSmall = () => {
  return <ImagePlaceHolder size={5} />
}

const ImagePlacerHolderNormal = () => {
  return <ImagePlaceHolder size={10} />
}

const EmbedThumbnail = () => {
  return <ImagePlaceHolder size={15} />
}

const embedHeaderStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '15px',
})

const embedInputStyle = css({
  bg: 'none',
  border: 'none',
  outline: 'none',
  color: 'fonts.primary',
  fontSize: '13px',
  _placeholder: {
    color: 'fonts.secondary',
  },
})

const embedTextAreaStyle = css({
  bg: 'none',
  outline: 'none',
  border: 'none',
  resize: 'none',
  width: '100%',
  color: 'fonts.primary',
  fontSize: '15px',
  _placeholder: {
    color: 'fonts.secondary',
  },
})

type EmbedHeaderProps = UseFormReturn<EmbedForm, any, undefined> &
  Pick<EmbedBuilderProps, 'images'>

const EmbedHeader = (props: EmbedHeaderProps) => {
  const { images, register } = props

  return (
    <header className={embedHeaderStyle}>
      <FlexColumn className={css({ gap: '15px', flex: '1' })}>
        <Flex className={css({ gap: '10px' })}>
          {images ? <ImagePlacerHolderSmall /> : null}
          <input
            className={embedInputStyle}
            placeholder={'Author'}
            spellCheck={false}
            type="text"
            {...register('author.name')}
          />
        </Flex>
        <FlexColumn className={css({ gap: '5px', flex: '1' })}>
          <input
            spellCheck={false}
            className={embedInputStyle}
            placeholder="Title"
            type="text"
            {...register('title')}
          />
          <textarea
            spellCheck={false}
            className={embedTextAreaStyle}
            placeholder="Description"
            {...register('description')}
          />
        </FlexColumn>
      </FlexColumn>

      {images ? <ImagePlacerHolderNormal /> : null}
    </header>
  )
}

type EmbedFooterProps = UseFormReturn<EmbedForm, any, undefined> &
  Pick<EmbedBuilderProps, 'images'>

const EmbedFooter = (props: EmbedFooterProps) => {
  const { images, register, control } = props
  return (
    <Flex style={{ alignItems: 'flex-end', marginTop: '10px' }}>
      <Flex>
        {images ? <ImagePlacerHolderSmall /> : null}
        <input
          spellCheck={false}
          className={cx(embedInputStyle, css({ ml: '5px' }))}
          placeholder="Pied de page"
          type="text"
          {...register('footer.text')}
        />
      </Flex>
      <Flex className={css({ alignItems: 'center', gap: '5px' })}>
        <Controller
          name="timestamp"
          control={control}
          render={({ field }) => {
            return <Checkbox {...field}>Timestamp</Checkbox>
          }}
        />
      </Flex>
    </Flex>
  )
}

const fieldInputStyle = css({
  bg: 'none',
  border: 'none',
  outline: 'none',
  color: 'fonts.primary',
  resize: 'none',
  _placeholder: {
    color: 'fonts.secondary',
  },
  fontSize: '13px',
  fontWeight: '200',
})

type EmbedFieldsWrapperProps = {
  fields: EmbedWrapperField[]
  setValue: UseFormSetValue<EmbedForm>
  getValues: UseFormGetValues<EmbedForm>
}
type EmbedWrapperField = Pick<APIEmbedField, 'name' | 'value'> & {
  id: string
}

type EmbedFieldChangeType = 'name' | 'value' | 'inline'
const EmbedFieldsWrapper = ({
  fields,
  setValue,
  getValues,
}: EmbedFieldsWrapperProps) => {
  const handleChange = (
    type: EmbedFieldChangeType,
    value: string,
    id: string
  ) => {
    const newFields = getValues('fields')?.map((field) => {
      if (field.id !== id) {
        return field
      }

      if (type === 'name') {
        return { ...field, name: value }
      }

      if (type === 'value') {
        return { ...field, value: value }
      }

      if (type === 'inline') {
        return { ...field, inline: !field.inline }
      }

      return field
    })

    setValue('fields', newFields)
  }

  const handleDelete = (id: string) => {
    const newFields =
      getValues('fields')?.filter((field) => field?.id !== id) ?? []

    setValue('fields', newFields)
  }
  return (
    <Flex className={css({ gap: '7px' })}>
      {fields.map((field) => {
        return (
          <FlexColumn
            className={css({ flex: '1', maxW: '170px' })}
            key={field.id}
          >
            <Flex style={{ paddingBottom: '2px' }}>
              <Trash
                onClick={() => handleDelete(field.id)}
                style={{ cursor: 'pointer' }}
                color="#dc3545"
                size={17}
              />
              <GanttChart
                onClick={() => handleChange('inline', '', field.id)}
                style={{ cursor: 'pointer' }}
                color={field?.inline ? '#007bff' : 'grey'}
                size={17}
              />
            </Flex>
            <input
              className={cx(
                fieldInputStyle,
                css({ fontSize: '15px', fontWeight: '500' })
              )}
              value={field.name}
              placeholder="Name"
              onChange={(e) => handleChange('name', e.target.value, field.id)}
            />
            <textarea
              className={fieldInputStyle}
              value={field.value}
              placeholder="Value"
              onChange={(e) => handleChange('value', e.target.value, field.id)}
            />
          </FlexColumn>
        )
      })}
    </Flex>
  )
}

type EmbedFieldsProps = UseFormReturn<EmbedForm, any, undefined>

const EmbedFields = (
  props: EmbedFieldsProps & { _fields?: APIEmbedField[] }
) => {
  const { setValue, getValues, watch } = props

  const watchedFields = watch('fields')

  const addField = () => {
    setValue('fields', [
      ...(getValues('fields') ?? []),
      { name: '', value: '', inline: false, id: crypto.randomUUID() },
    ])
  }

  const buildFields = (
    _fields: APIEmbedField[] = [],
    defaultState: React.ReactNode[] = []
  ) => {
    const dataToReturn = defaultState

    for (let idx = 0; idx < _fields.length; idx++) {
      const field = _fields[idx]
      const nextField = _fields[idx + 1]
      const thirdField = _fields[idx + 2]

      if (!field.inline) {
        dataToReturn.push(
          <EmbedFieldsWrapper
            setValue={setValue}
            getValues={getValues}
            fields={[field]}
          />
        )
      } else if (field.inline && (!nextField || !nextField.inline)) {
        dataToReturn.push(
          <EmbedFieldsWrapper
            setValue={setValue}
            getValues={getValues}
            fields={[field]}
          />
        )
      } else if (
        field.inline &&
        nextField &&
        nextField.inline &&
        !thirdField?.inline
      ) {
        dataToReturn.push(
          <EmbedFieldsWrapper
            setValue={setValue}
            getValues={getValues}
            fields={[field, nextField]}
          />
        )
        idx++
      } else if (field.inline && nextField?.inline && thirdField?.inline) {
        dataToReturn.push(
          <EmbedFieldsWrapper
            setValue={setValue}
            getValues={getValues}
            fields={[field, nextField, thirdField]}
          />
        )
        idx++
        idx++
      }
    }

    return dataToReturn
  }

  return (
    <div>
      {buildFields(watchedFields)}
      <Button variants={{ format: 'square', visual: 'primary' }}>
        <Plus onClick={addField} />
      </Button>
    </div>
  )
}

type EmbedBuilderProps = {
  images?: boolean
  data: APIEmbed
}

type EmbedForm = APIEmbed & {
  formatedColor: string
}

export const useEmbedBuilder = (options: EmbedBuilderProps) => {
  const { data, images } = options
  const { handleSubmit, getValues, ...rest } = useForm<EmbedForm>({
    defaultValues: {
      author: {
        name: data?.author?.name,
        icon_url: data?.author?.icon_url,
        proxy_icon_url: data?.author?.proxy_icon_url,
        url: data?.author?.url,
      },
      title: data.title,
      description: data.description,
      footer: {
        text: data?.footer?.text,
        icon_url: data?.footer?.icon_url,
        proxy_icon_url: data?.footer?.proxy_icon_url,
      },
      timestamp: data.timestamp,
      thumbnail: {
        url: data?.thumbnail?.url,
        height: data?.thumbnail?.height,
        width: data?.thumbnail?.width,
        proxy_url: data?.thumbnail?.proxy_url,
      },
      fields: data.fields,
      color: data.color,
      formatedColor: `#${data?.color?.toString(16)}`,
      image: {
        url: data?.image?.url,
        height: data?.image?.height,
        width: data?.image?.width,
        proxy_url: data?.image?.proxy_url,
      },
      url: data?.url,
    },
  })

  return {
    Embed: (
      <EmbedBuilder
        images={images}
        data={getValues()}
        form={{
          ...rest,
          handleSubmit,
          getValues,
        }}
      />
    ),

    getValues,
  }
}

const EmbedColorPicker = () => {
  return <div>color picker</div>
}

export const EmbedBuilder = (
  props: EmbedBuilderProps & { form: UseFormReturn<EmbedForm, any, undefined> }
) => {
  const { images, form } = props

  const { getValues, ...rest } = form

  return (
    <div className={embedStyle}>
      <span
        className={css({
          pos: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '3px',
        })}
        style={{ backgroundColor: `${getValues('formatedColor')}` }}
      />

      <EmbedColorPicker />
      <EmbedHeader getValues={getValues} {...rest} images={images} />
      <EmbedFields
        _fields={getValues('fields')}
        getValues={getValues}
        {...rest}
      />
      {images ? <EmbedThumbnail /> : null}
      <EmbedFooter getValues={getValues} {...rest} images={images} />
    </div>
  )
}
