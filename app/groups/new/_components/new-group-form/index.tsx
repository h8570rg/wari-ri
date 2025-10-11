"use client";

import { Button, Group, Pill, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { createGroup } from "./actions";
import { newGroupSchema, userNameSchema } from "./schema";

export function NewGroupForm() {
	const userNameForm = useForm({
		initialValues: {
			userName: "",
		},
		validate: zod4Resolver(userNameSchema),
	});

	const form = useForm({
		initialValues: {
			name: "",
			userNames: [] as string[],
		},
		validate: zod4Resolver(newGroupSchema),
	});

	const handleSubmit = async (values: typeof form.values) => {
		await createGroup({
			name: values.name,
			userNames: values.userNames,
		});
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<TextInput
				label="グループ名"
				placeholder="北海道旅行"
				autoFocus
				{...form.getInputProps("name")}
			/>
			<TextInput
				mt="md"
				w="100%"
				label="メンバー"
				placeholder="やまだ"
				{...userNameForm.getInputProps("userName")}
				error={
					userNameForm.getInputProps("userName").error ?? form.errors.userNames
				}
				styles={{
					wrapper: {
						flex: 1,
					},
				}}
				inputContainer={(children) => (
					<Group gap="xs">
						{children}
						<Button
							onClick={() => {
								const userNameValue = userNameForm.getValues().userName;
								const userNamesValue = form.getValues().userNames;
								if (userNamesValue.includes(userNameValue)) {
									userNameForm.setFieldError(
										"userName",
										"ユーザー名が重複しています",
									);
									return;
								}
								const validateResult = userNameForm.validateField("userName");
								if (validateResult.hasError) {
									return;
								}
								form.insertListItem("userNames", userNameValue);
								userNameForm.reset();
								form.clearFieldError("userNames");
							}}
							color="secondary"
						>
							追加
						</Button>
					</Group>
				)}
			/>
			<Pill.Group mt="xs">
				{form.values.userNames.map((userName, index) => (
					<Pill
						key={userName}
						size="lg"
						withRemoveButton
						onRemove={() => {
							form.removeListItem("userNames", index);
						}}
					>
						{userName}
					</Pill>
				))}
			</Pill.Group>
			<Button
				type="submit"
				mt="lg"
				w="100%"
				size="xl"
				loading={form.submitting}
			>
				グループを作成
			</Button>
		</form>
	);
}
